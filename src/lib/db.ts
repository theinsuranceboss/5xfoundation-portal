import { PrismaClient } from '../generated/client';
import { supabase } from './supabase';
import * as fs from 'fs';
import * as path from 'path';
import { AsyncLocalStorage } from 'async_hooks';

// AsyncLocalStorage storage context for bypassing auto-upload on write operations
export const batchUploadStorage = new AsyncLocalStorage<boolean>();

// Determine if we are running inside a serverless environment (Netlify/Vercel/AWS Lambda)
const isServerless = process.platform !== 'win32' || !!process.env.NETLIFY || !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.LAMBDA_TASK_ROOT;

// SQLite file path
const dbPath = isServerless ? '/tmp/dev.db' : path.join(process.cwd(), 'prisma', 'dev.db');
const dbUrl = `file:${dbPath}`;

// Force override process.env.DATABASE_URL to make sure Prisma Client uses the resolved path
// and ignores any conflicting DATABASE_URL variables set in the Netlify site settings.
process.env.DATABASE_URL = dbUrl;

let lastCheckedTime = 0;

// Helper to ensure database is downloaded locally from Supabase Storage
export async function ensureDb() {
  if (isServerless) {
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckedTime;
    
    // Avoid checking Supabase Storage metadata more than once every 2 seconds
    if (fs.existsSync(dbPath) && fs.statSync(dbPath).size >= 10240 && timeSinceLastCheck < 2000) {
      return;
    }
    
    lastCheckedTime = now;
    console.log(`[db.ts] Ensuring database is up-to-date at ${dbPath}...`);
    
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      // 1. Fetch remote dev.db metadata to check the updated_at timestamp
      const { data: files, error: listError } = await supabase.storage
        .from('5x_assets')
        .list('', {
          limit: 1,
          search: 'dev.db'
        });

      const remoteDb = files?.find(f => f.name === 'dev.db');
      
      let shouldDownload = true;
      if (fs.existsSync(dbPath) && fs.statSync(dbPath).size >= 10240) {
        shouldDownload = false;
      }
      
      if (remoteDb && remoteDb.updated_at && fs.existsSync(dbPath) && !shouldDownload) {
        const localMtime = fs.statSync(dbPath).mtimeMs;
        const remoteMtime = new Date(remoteDb.updated_at).getTime();
        
        // Remote database is newer than the local database copy
        if (remoteMtime > localMtime + 1000) { // 1s buffer
          console.log(`[db.ts] Remote database is newer than local copy (remote: ${new Date(remoteMtime).toISOString()}, local: ${new Date(localMtime).toISOString()}). Will download...`);
          shouldDownload = true;
        }
      }

      if (shouldDownload) {
        if (remoteDb) {
          console.log(`[db.ts] Downloading dev.db from Supabase Storage...`);
          const { data, error } = await supabase.storage
            .from('5x_assets')
            .download('dev.db');

          if (error) {
            console.error(`[db.ts] Failed to download dev.db from Supabase Storage: ${error.message}`);
          } else if (data) {
            const buffer = Buffer.from(await data.arrayBuffer());
            fs.writeFileSync(dbPath, buffer);
            console.log(`[db.ts] Downloaded dev.db from Supabase Storage (${buffer.length} bytes).`);
          }
        } else {
          console.warn(`[db.ts] dev.db not found in Supabase Storage. Checking if local template exists...`);
          // Use template relative to __dirname so Next.js static asset tracing bundles it
          const templatePath = path.join(__dirname, '..', '..', 'prisma', 'dev.db');
          if (fs.existsSync(templatePath)) {
            fs.copyFileSync(templatePath, dbPath);
            console.log(`[db.ts] Initialized ${dbPath} from local template.`);
            await uploadDbToSupabase();
          } else {
            console.error(`[db.ts] Template database not found at ${templatePath}`);
          }
        }
      } else {
        console.log(`[db.ts] Local database copy is up-to-date.`);
      }
    } catch (err) {
      console.error("[db.ts] Error resolving database:", err);
    }
  } else {
    // In local development, ensure the file is present
    if (!fs.existsSync(dbPath)) {
      console.warn(`[db.ts] Local database not found at ${dbPath}.`);
    }
  }
}

// Helper to upload SQLite database back to Supabase Storage
export async function uploadDbToSupabase() {
  if (!fs.existsSync(dbPath)) {
    console.warn(`[db.ts] Database file does not exist at ${dbPath}, skipping upload.`);
    return;
  }

  try {
    console.log(`[db.ts] Uploading ${dbPath} to Supabase Storage bucket '5x_assets' as 'dev.db'...`);
    const buffer = fs.readFileSync(dbPath);
    
    const { error: uploadError } = await supabase.storage
      .from('5x_assets')
      .upload('dev.db', buffer, {
        contentType: 'application/x-sqlite3',
        upsert: true
      });

    if (uploadError) {
      console.warn(`[db.ts] Supabase upload failed, creating bucket '5x_assets' first: ${uploadError.message}`);
      await supabase.storage.createBucket('5x_assets', { public: true });
      
      const { error: retryError } = await supabase.storage
        .from('5x_assets')
        .upload('dev.db', buffer, {
          contentType: 'application/x-sqlite3',
          upsert: true
        });

      if (retryError) {
        console.error(`[db.ts] Failed to upload database on retry: ${retryError.message}`);
      } else {
        console.log(`[db.ts] Database successfully uploaded to Supabase on retry.`);
        // Set last checked time to now to prevent immediate re-download
        lastCheckedTime = Date.now();
      }
    } else {
      console.log(`[db.ts] Database successfully uploaded to Supabase.`);
      // Set last checked time to now to prevent immediate re-download
      lastCheckedTime = Date.now();
    }
  } catch (err) {
    console.error("[db.ts] Error uploading database:", err);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: any
};

const basePrisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma;

// Extended client to automatically handle download/upload of SQLite database
export const db = basePrisma.$extends({
  query: {
    $allOperations: async ({ model, operation, args, query }: any) => {
      // Ensure the database exists locally (downloads from Supabase if serverless)
      await ensureDb();

      // Execute the database query
      const result = await query(args);

      // If this query was a write mutation, upload the database back to Supabase
      const isWrite = ['create', 'update', 'delete', 'updateMany', 'deleteMany', 'createMany', 'upsert'].includes(operation);
      const isBatch = batchUploadStorage.getStore() === true;
      if (isWrite && !isBatch) {
        // Upload to Supabase Storage
        await uploadDbToSupabase();
      }

      return result;
    }
  }
});
