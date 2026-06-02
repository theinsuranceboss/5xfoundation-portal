import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Quick check - if products already exist, skip seeding
    const existingCount = await db.product.count();
    if (existingCount > 0) {
      return NextResponse.json({ success: true, results: ['Already seeded'] });
    }

    // Create categories
    const allProducts = await db.category.upsert({
      where: { slug: 'all' },
      update: {},
      create: { name: 'All Products', slug: 'all', order: 0 },
    });

    const hoodies = await db.category.upsert({
      where: { slug: 'hoodies' },
      update: {},
      create: { name: 'Hoodies', slug: 'hoodies', order: 1 },
    });

    const tshirts = await db.category.upsert({
      where: { slug: 't-shirts' },
      update: {},
      create: { name: 'T-Shirts', slug: 't-shirts', order: 2 },
    });

    const donations = await db.category.upsert({
      where: { slug: 'donations' },
      update: {},
      create: { name: 'Donations', slug: 'donations', order: 3 },
    });

    const productsData = [
      {
        title: 'Classic Black Hoodie',
        description: 'Stay warm and stylish with our Classic Black Hoodie. Made from premium 80% cotton / 20% polyester blend with a soft fleece interior. Features a double-lined hood, kangaroo pocket, and ribbed cuffs. Perfect for layering or wearing solo on cool days.',
        price: 49.99,
        compareAt: 65.00,
        categoryId: hoodies.id,
        images: [
          { url: '/products/hoodie-black-front.png', type: 'front', order: 0 },
          { url: '/products/hoodie-black-back.png', type: 'back', order: 1 },
        ],
        variants: [
          { color: 'Black', size: 'S', stock: 15, sku: 'BLK-HOOD-S' },
          { color: 'Black', size: 'M', stock: 25, sku: 'BLK-HOOD-M' },
          { color: 'Black', size: 'L', stock: 20, sku: 'BLK-HOOD-L' },
          { color: 'Black', size: 'XL', stock: 12, sku: 'BLK-HOOD-XL' },
          { color: 'Black', size: 'XXL', stock: 8, sku: 'BLK-HOOD-XXL' },
        ],
      },
      {
        title: 'Navy Blue Hoodie',
        description: 'Elevate your streetwear game with our Navy Blue Hoodie. Crafted from heavyweight 320gsm cotton-blend fabric, this hoodie offers exceptional warmth and durability. Features a relaxed fit, adjustable drawstring hood, and a front kangaroo pocket.',
        price: 54.99,
        compareAt: null,
        categoryId: hoodies.id,
        images: [
          { url: '/products/hoodie-navy-front.png', type: 'front', order: 0 },
          { url: '/products/hoodie-navy-back.png', type: 'back', order: 1 },
        ],
        variants: [
          { color: 'Navy', size: 'S', stock: 10, sku: 'NAV-HOOD-S' },
          { color: 'Navy', size: 'M', stock: 20, sku: 'NAV-HOOD-M' },
          { color: 'Navy', size: 'L', stock: 18, sku: 'NAV-HOOD-L' },
          { color: 'Navy', size: 'XL', stock: 10, sku: 'NAV-HOOD-XL' },
          { color: 'Navy', size: 'XXL', stock: 5, sku: 'NAV-HOOD-XXL' },
        ],
      },
      {
        title: 'Forest Green Hoodie',
        description: 'Connect with nature in our Forest Green Hoodie. This earth-toned essential is made from organic cotton blend with a brushed interior for maximum comfort. Features eco-friendly dyes, a cozy oversized fit, and reinforced stitching for long-lasting wear.',
        price: 52.99,
        compareAt: null,
        categoryId: hoodies.id,
        images: [
          { url: '/products/hoodie-green-front.png', type: 'front', order: 0 },
          { url: '/products/hoodie-green-back.png', type: 'back', order: 1 },
        ],
        variants: [
          { color: 'Forest Green', size: 'S', stock: 8, sku: 'GRN-HOOD-S' },
          { color: 'Forest Green', size: 'M', stock: 15, sku: 'GRN-HOOD-M' },
          { color: 'Forest Green', size: 'L', stock: 12, sku: 'GRN-HOOD-L' },
          { color: 'Forest Green', size: 'XL', stock: 6, sku: 'GRN-HOOD-XL' },
          { color: 'Forest Green', size: 'XXL', stock: 3, sku: 'GRN-HOOD-XXL' },
        ],
      },
      {
        title: 'Essential White Tee',
        description: 'The perfect foundation for any outfit. Our Essential White Tee is made from 100% premium combed cotton with a smooth finish. Features a classic crew neck, reinforced shoulder seams, and a comfortable regular fit. Pre-shrunk for consistent sizing wash after wash.',
        price: 24.99,
        compareAt: 30.00,
        categoryId: tshirts.id,
        images: [
          { url: '/products/tshirt-white-front.png', type: 'front', order: 0 },
          { url: '/products/tshirt-white-back.png', type: 'back', order: 1 },
        ],
        variants: [
          { color: 'White', size: 'S', stock: 30, sku: 'WHT-TEE-S' },
          { color: 'White', size: 'M', stock: 40, sku: 'WHT-TEE-M' },
          { color: 'White', size: 'L', stock: 35, sku: 'WHT-TEE-L' },
          { color: 'White', size: 'XL', stock: 20, sku: 'WHT-TEE-XL' },
          { color: 'White', size: 'XXL', stock: 15, sku: 'WHT-TEE-XXL' },
        ],
      },
      {
        title: 'Charcoal Graphic Tee',
        description: 'Make a statement with our Charcoal Graphic Tee. Featuring original artwork screen-printed with eco-friendly water-based inks. Made from a soft 60% cotton / 40% polyester blend for the perfect balance of comfort and durability. Modern slim fit design.',
        price: 29.99,
        compareAt: null,
        categoryId: tshirts.id,
        images: [
          { url: '/products/tshirt-gray-front.png', type: 'front', order: 0 },
          { url: '/products/tshirt-gray-back.png', type: 'back', order: 1 },
        ],
        variants: [
          { color: 'Charcoal', size: 'S', stock: 20, sku: 'CHR-TEE-S' },
          { color: 'Charcoal', size: 'M', stock: 30, sku: 'CHR-TEE-M' },
          { color: 'Charcoal', size: 'L', stock: 25, sku: 'CHR-TEE-L' },
          { color: 'Charcoal', size: 'XL', stock: 15, sku: 'CHR-TEE-XL' },
          { color: 'Charcoal', size: 'XXL', stock: 10, sku: 'CHR-TEE-XXL' },
        ],
      },
      {
        title: 'Support Our Mission',
        description: 'Your generous donation helps us continue our mission of creating sustainable, ethically-made apparel. Every contribution goes directly toward fair wages, eco-friendly materials, and community programs. Thank you for being part of the change.',
        price: 17.00,
        compareAt: null,
        categoryId: donations.id,
        images: [
          { url: '/products/donation-support.png', type: 'front', order: 0 },
        ],
        variants: [
          { color: 'Default', size: 'One Size', stock: 999, sku: 'DON-1' },
        ],
      },
    ];

    const results: string[] = [];

    for (const productData of productsData) {
      const existing = await db.product.findFirst({ where: { title: productData.title } });
      if (existing) {
        results.push(`Skipped: ${productData.title}`);
        continue;
      }

      const product = await db.product.create({
        data: {
          title: productData.title,
          description: productData.description,
          price: productData.price,
          compareAt: productData.compareAt,
          categoryId: productData.categoryId,
          images: { create: productData.images },
          variants: { create: productData.variants },
        },
      });
      results.push(`Created: ${product.title}`);
    }

    // Create payment configs
    await db.paymentConfig.upsert({
      where: { provider: 'stripe' },
      update: {},
      create: { provider: 'stripe', apiKey: '', link: '', isActive: false },
    });
    await db.paymentConfig.upsert({
      where: { provider: 'paypal' },
      update: {},
      create: { provider: 'paypal', apiKey: '', link: '', isActive: false },
    });
    results.push('Payment configs created');

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
