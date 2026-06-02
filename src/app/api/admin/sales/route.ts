import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Seed helper to populate realistic orders if none exist
async function seedMockOrders() {
  const products = await db.product.findMany({
    include: {
      images: true,
      variants: true,
    },
  });

  if (products.length === 0) return [];

  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'hotmail.com'];

  const ordersToCreate = [];

  // Generate sales spread over the last 12 months (e.g. June 2025 to May 2026)
  const now = new Date();
  
  for (let m = 11; m >= 0; m--) {
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const yearStr = targetMonth.getFullYear();
    const monthStr = String(targetMonth.getMonth() + 1).padStart(2, '0');

    // Number of orders in this month (realistic distribution, e.g. holiday peaks in November/December)
    let monthlyVolume = 8 + Math.floor(Math.random() * 8); // baseline 8-15 orders
    if (m === 5 || m === 6) monthlyVolume += 8; // Summer peak
    if (m === 0 || m === 1) monthlyVolume += 15; // Recent peaks / holiday hangover

    for (let o = 0; o < monthlyVolume; o++) {
      // Pick random date within the month
      const maxDays = new Date(yearStr, targetMonth.getMonth() + 1, 0).getDate();
      const randDay = 1 + Math.floor(Math.random() * maxDays);
      const randHour = Math.floor(Math.random() * 24);
      const randMinute = Math.floor(Math.random() * 60);
      const orderDate = new Date(yearStr, targetMonth.getMonth(), randDay, randHour, randMinute);

      // Random Customer Info
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${fName} ${lName}`;
      const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${Math.floor(Math.random() * 100)}@${emailDomains[Math.floor(Math.random() * emailDomains.length)]}`;

      // Pick 1 to 3 random items
      const itemCount = 1 + Math.floor(Math.random() * 3);
      const selectedItems = [];
      let total = 0;

      for (let i = 0; i < itemCount; i++) {
        const prod = products[Math.floor(Math.random() * products.length)];
        const qty = 1 + Math.floor(Math.random() * 2);
        
        // Pick a random variant or default
        let variant = prod.variants[Math.floor(Math.random() * prod.variants.length)];
        let color = 'Default';
        let size = 'One Size';
        let variantId = null;

        if (variant) {
          color = variant.color.split('|')[0] || 'Default';
          size = variant.size || 'One Size';
          variantId = variant.id;
        }

        const price = prod.price;
        total += price * qty;

        selectedItems.push({
          productId: prod.id,
          variantId,
          color,
          size,
          quantity: qty,
          price,
        });
      }

      // 90% Completed, 10% Pending
      const status = Math.random() > 0.1 ? 'completed' : 'pending';

      ordersToCreate.push({
        name,
        email,
        total: Math.round(total * 100) / 100,
        status,
        createdAt: orderDate,
        updatedAt: orderDate,
        items: selectedItems
      });
    }
  }

  // Insert orders sequentially
  for (const ord of ordersToCreate) {
    await db.order.create({
      data: {
        name: ord.name,
        email: ord.email,
        total: ord.total,
        status: ord.status,
        createdAt: ord.createdAt,
        updatedAt: ord.updatedAt,
        items: {
          create: ord.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });
  }

  console.log(`Successfully seeded ${ordersToCreate.length} mock orders.`);
}

export async function GET() {
  try {
    // 1. If 0 orders in database, auto-seed mock history
    const orderCount = await db.order.count();
    if (orderCount === 0) {
      await seedMockOrders();
    }

    // 2. Fetch all orders
    const orders = await db.order.findMany({
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 3. Compute Summary Statistics for Completed Orders
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    let totalRevenue = 0;
    let totalItemsSold = 0;
    const totalOrders = completedOrders.length;

    completedOrders.forEach(o => {
      totalRevenue += o.total;
      o.items.forEach(item => {
        totalItemsSold += item.quantity;
      });
    });

    totalRevenue = Math.round(totalRevenue * 100) / 100;
    const averageOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

    const summary = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalItemsSold
    };

    // 4. Group Sales by Month (YYYY-MM)
    const monthlyMap = new Map<string, { month: string, revenue: number, orders: number }>();
    
    completedOrders.forEach(o => {
      const date = new Date(o.createdAt);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthStr)) {
        monthlyMap.set(monthStr, { month: monthStr, revenue: 0, orders: 0 });
      }
      const data = monthlyMap.get(monthStr)!;
      data.revenue += o.total;
      data.orders += 1;
    });

    // Sort months chronologically
    const monthlySales = Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
    // Round monthly revenues
    monthlySales.forEach(m => {
      m.revenue = Math.round(m.revenue * 100) / 100;
    });

    // 5. Group Sales Day-by-Day per Month (for calendar comparison)
    // Format: { "YYYY-MM": [ { "day": 1, "revenue": 100, "orders": 2 } ] }
    const dailySales: Record<string, { day: number, revenue: number, orders: number }[]> = {};

    completedOrders.forEach(o => {
      const date = new Date(o.createdAt);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const day = date.getDate();

      if (!dailySales[monthStr]) {
        dailySales[monthStr] = [];
      }

      let dayData = dailySales[monthStr].find(d => d.day === day);
      if (!dayData) {
        dayData = { day, revenue: 0, orders: 0 };
        dailySales[monthStr].push(dayData);
      }

      dayData.revenue += o.total;
      dayData.orders += 1;
    });

    // Ensure all daily arrays are sorted chronologically and revenues rounded
    Object.keys(dailySales).forEach(month => {
      dailySales[month].sort((a, b) => a.day - b.day);
      dailySales[month].forEach(d => {
        d.revenue = Math.round(d.revenue * 100) / 100;
      });
    });

    // 6. Aggregate Best Selling Products
    const bestSellersMap = new Map<string, { 
      productId: string, 
      title: string, 
      price: number, 
      image: string, 
      quantitySold: number, 
      revenue: number 
    }>();

    completedOrders.forEach(o => {
      o.items.forEach(item => {
        const prodId = item.productId;
        const prodTitle = item.product?.title || 'Unknown Product';
        const prodPrice = item.price;
        const frontImg = item.product?.images?.find(img => img.type === 'front')?.url || item.product?.images?.[0]?.url || '';

        if (!bestSellersMap.has(prodId)) {
          bestSellersMap.set(prodId, {
            productId: prodId,
            title: prodTitle,
            price: prodPrice,
            image: frontImg,
            quantitySold: 0,
            revenue: 0
          });
        }

        const data = bestSellersMap.get(prodId)!;
        data.quantitySold += item.quantity;
        data.revenue += item.price * item.quantity;
      });
    });

    const bestSellers = Array.from(bestSellersMap.values())
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .map(item => ({
        ...item,
        revenue: Math.round(item.revenue * 100) / 100
      }));

    // 7. Format recent orders details (limit to latest 30 orders)
    const formattedOrders = orders.slice(0, 30).map(o => ({
      id: o.id,
      name: o.name || 'Anonymous Customer',
      email: o.email || 'N/A',
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      itemsCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
      itemsList: o.items.map(i => `${i.product?.title || 'Product'} (${i.color} / ${i.size}) x${i.quantity}`)
    }));

    return NextResponse.json({
      summary,
      monthlySales,
      dailySales,
      bestSellers,
      recentOrders: formattedOrders
    });
  } catch (error: any) {
    console.error('Failed to query sales database:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
