// Shared utility functions for the flower e-commerce website

// Format order ID
function formatOrderId(orderId) {
    return 'ORD-' + orderId.toString().padStart(8, '0');
}

// Calculate estimated delivery date (3-5 business days)
function calculateDeliveryDate() {
    const today = new Date();
    // Add 3-5 business days (we'll use 4 as average)
    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + 4);
    
    // Format date
    return deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format date for display
function formatDate(dateString) {
    if (!dateString || dateString === 'Processing') return 'Processing';
    
    // If it's already a formatted date string, return as is
    if (typeof dateString === 'string' && !dateString.includes('T')) {
        return dateString;
    }
    
    // Otherwise, try to parse as date
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

// Format date and time for display
function formatDateTime(dateTimeString) {
    if (!dateTimeString || dateTimeString === 'Processing') return 'Processing';
    
    try {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateTimeString;
    }
}

// Generate order status timeline with realistic statuses
function generateOrderStatusTimeline(status) {
    const timeline = [
        {
            status: 'Order Placed',
            date: new Date().toLocaleString(),
            description: 'Your order has been placed successfully'
        }
    ];
    
    // Add statuses based on current status
    if (status === 'Processing' || status === 'Packaging' || status === 'Dispatched' || status === 'In Transit' || status === 'Delivered') {
        timeline.push({
            status: 'Processing',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString(), // 1 day ago
            description: 'We are preparing your order for shipment'
        });
    }
    
    if (status === 'Packaging' || status === 'Dispatched' || status === 'In Transit' || status === 'Delivered') {
        timeline.push({
            status: 'Packaging',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toLocaleString(), // 2 days ago
            description: 'Your order is being carefully packaged'
        });
    }
    
    if (status === 'Dispatched' || status === 'In Transit' || status === 'Delivered') {
        timeline.push({
            status: 'Dispatched',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toLocaleString(), // 3 days ago
            description: 'Your order has been dispatched from our warehouse'
        });
    }
    
    if (status === 'In Transit' || status === 'Delivered') {
        timeline.push({
            status: 'In Transit',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toLocaleString(), // 4 days ago
            description: 'Your order is on its way to you'
        });
    }
    
    if (status === 'Delivered') {
        timeline.push({
            status: 'Delivered',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toLocaleString(), // 5 days ago
            description: 'Your order has been delivered successfully'
        });
    }
    
    // Return timeline in chronological order (oldest first)
    return timeline.reverse();
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Check if user is logged in
function checkLoginStatus() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Get order status based on order age
function getOrderStatusByAge(orderDate) {
    const orderDateTime = new Date(orderDate);
    const now = new Date();
    const diffDays = Math.floor((now - orderDateTime) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Processing';
    if (diffDays === 1) return 'Packaging';
    if (diffDays === 2) return 'Dispatched';
    if (diffDays === 3) return 'In Transit';
    if (diffDays >= 4) return 'Delivered';
    
    return 'Processing';
}