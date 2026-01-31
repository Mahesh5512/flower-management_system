const { connectToDatabase } = require('./backend/db');

async function checkData() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      console.log('Could not connect to database');
      return;
    }

    console.log('=== PRODUCTS ===');
    const [products] = await db.execute('SELECT * FROM products');
    console.log(products);

    console.log('\n=== USERS ===');
    const [users] = await db.execute('SELECT * FROM users');
    console.log(users);

    console.log('\n=== ORDERS ===');
    const [orders] = await db.execute('SELECT * FROM orders');
    console.log(orders);

    console.log('\n=== ORDER ITEMS ===');
    const [orderItems] = await db.execute('SELECT * FROM order_items');
    console.log(orderItems);

  } catch (error) {
    console.error('Error checking data:', error);
  }
}

checkData();