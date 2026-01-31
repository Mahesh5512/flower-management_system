const { connectToDatabase } = require('./backend/db');

async function debugOrder() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      console.log('Could not connect to database');
      return;
    }

    // Test the query directly
    const orderReference = 'ORD-00000001';
    console.log('Searching for order with reference:', orderReference);
    
    const [orderRows] = await db.execute('SELECT * FROM orders WHERE orderReference = ?', [orderReference]);
    console.log('Order rows found:', orderRows.length);
    console.log('Order data:', orderRows);
    
    if (orderRows.length > 0) {
      const order = orderRows[0];
      console.log('Order ID:', order.id);
      
      // Get order items
      const [itemRows] = await db.execute('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
      console.log('Item rows found:', itemRows.length);
      console.log('Item data:', itemRows);
    }

  } catch (error) {
    console.error('Error debugging order:', error);
  }
}

debugOrder();