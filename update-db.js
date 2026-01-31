const { connectToDatabase } = require('./backend/db');

async function updateDatabase() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      console.log('Could not connect to database');
      return;
    }

    // Add orderReference column to orders table
    await db.execute('ALTER TABLE orders ADD COLUMN orderReference VARCHAR(20) UNIQUE');
    console.log('Added orderReference column to orders table');

    // Update existing orders with orderReference values
    const [orders] = await db.execute('SELECT id FROM orders');
    for (const order of orders) {
      const orderReference = 'ORD-' + order.id.toString().padStart(8, '0');
      await db.execute('UPDATE orders SET orderReference = ? WHERE id = ?', [orderReference, order.id]);
    }
    console.log('Updated existing orders with orderReference values');

  } catch (error) {
    console.error('Error updating database:', error);
  }
}

updateDatabase();