const http = require('http');

// Simulate the exact data that would be in localStorage
const currentUser = {
  "id": 2,
  "username": "user1",
  "email": "user1@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
};

const cart = [
  {
    "id": 1,
    "name": "Red Roses",
    "price": 2489.17,
    "quantity": 2
  }
];

console.log('Current User:', JSON.stringify(currentUser, null, 2));
console.log('Cart:', JSON.stringify(cart, null, 2));

// Simulate the order data as it would be constructed in the frontend
const orderData = {
  userId: currentUser.id,
  userName: `${currentUser.firstName} ${currentUser.lastName}`,
  userEmail: currentUser.email,
  products: cart.map(item => ({
    productId: item.id,
    productName: item.name,
    quantity: item.quantity,
    price: item.price
  })),
  totalAmount: 4968.34, // This would come from document.getElementById('total').textContent.replace('₹', '')
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'New York',
    zipCode: '10001'
  }
};

console.log('Order Data:', JSON.stringify(orderData, null, 2));

// Test the API call
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
    
    if (res.statusCode >= 400) {
      console.log('Error Response:', data);
    } else {
      try {
        const response = JSON.parse(data);
        console.log('Success Response:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('Response (not JSON):', data);
      }
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error);
});

req.write(postData);
req.end();