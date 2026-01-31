const http = require('http');

// Simulate the exact data structure that would come from localStorage
const user = {
  id: 2,
  username: 'user1',
  email: 'user1@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user'
};

const cart = [
  {
    id: 1,
    name: 'Red Roses',
    price: 29.99,
    quantity: 2
  }
];

const orderData = {
  userId: user.id,
  userName: `${user.firstName} ${user.lastName}`,
  userEmail: user.email,
  products: cart.map(item => ({
    productId: item.id,
    productName: item.name,
    quantity: item.quantity,
    price: item.price
  })),
  totalAmount: 59.98,
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'New York',
    zipCode: '10001'
  }
};

console.log('Sending order data:', JSON.stringify(orderData, null, 2));

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
    console.log('Headers:', res.headers);
    
    if (res.statusCode >= 400) {
      console.log('Error Response:', data);
    } else {
      try {
        const response = JSON.parse(data);
        console.log('Success Response:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('Response:', data);
      }
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error);
});

req.write(postData);
req.end();