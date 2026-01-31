const http = require('http');

const orderData = {
  userId: 2,
  userName: 'John Doe',
  userEmail: 'user1@example.com',
  products: [
    {
      productId: 1,
      productName: 'Red Roses',
      quantity: 2,
      price: 29.99
    }
  ],
  totalAmount: 59.98,
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'New York',
    zipCode: '10001'
  }
};

const postData = JSON.stringify(orderData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
    
    try {
      const response = JSON.parse(data);
      console.log('Parsed Response:', response);
    } catch (e) {
      console.log('Response is not JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();