// Generate a large catalog of flowers (fallback if API fails)
function generateFlowerCatalog() {
    const flowerTypes = [
        "Rose", "Tulip", "Sunflower", "Lily", "Orchid", "Daisy", "Carnation", "Peony",
        "Hydrangea", "Daffodil", "Chrysanthemum", "Poppy", "Lavender", "Jasmine", "Gardenia",
        "Camellia", "Azalea", "Begonia", "Marigold", "Zinnia", "Cosmos", "Snapdragon",
        "Foxglove", "Delphinium", "Lisianthus", "Freesia", "Gladiolus", "Alstroemeria",
        "Statice", "Limonium", "Eucalyptus", "Ranunculus", "Anemone", "Sweet Pea",
        "Stock", "Aster", "Celosia", "Buddleia", "Heather", "Protea"
    ];
    
    const colors = [
        "Red", "Pink", "White", "Yellow", "Purple", "Orange", "Blue", "Green",
        "Lavender", "Peach", "Coral", "Magenta", "Burgundy", "Cream", "Gold"
    ];
    
    const emojis = ["🌹", "🌷", "🌻", "百合", "🌸", "🌺", "🌼", "💐", "🥀", "🪷"];
    
    const flowers = [];
    
    // Generate 120 unique flower products
    for (let i = 1; i <= 120; i++) {
        const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        const flower = {
            id: i,
            name: `${color} ${flowerType}`,
            price: (Math.random() * 900 + 100).toFixed(2), // Price between ₹100-₹1000
            description: `Beautiful ${color.toLowerCase()} ${flowerType.toLowerCase()}s, perfect for any occasion. Freshly cut and delivered to your doorstep.`,
            image: emoji,
            category: flowerType
        };
        
        flowers.push(flower);
    }
    
    // Save to localStorage
    localStorage.setItem('flowers', JSON.stringify(flowers));
    return flowers;
}

// Get flowers from API or fallback to localStorage
async function getFlowers() {
    try {
        // Try to get flowers from API first
        if (window.API && typeof window.API.getFlowers === 'function') {
            return await window.API.getFlowers();
        } else {
            // Fallback to localStorage
            const flowers = JSON.parse(localStorage.getItem('flowers'));
            if (!flowers || flowers.length === 0) {
                return generateFlowerCatalog();
            }
            return flowers;
        }
    } catch (error) {
        console.error('Error fetching flowers, using localStorage:', error);
        // Fallback to localStorage
        const flowers = JSON.parse(localStorage.getItem('flowers'));
        if (!flowers || flowers.length === 0) {
            return generateFlowerCatalog();
        }
        return flowers;
    }
}

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeButtons = document.querySelectorAll('.close');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const productGrid = document.getElementById('productGrid');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// Check if user is logged in
function checkLoginStatus() {
    const user = localStorage.getItem('currentUser');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (user) {
        // User is logged in
        const userData = JSON.parse(user);
        let buttonsHTML = `
            <span class="welcome-user">${userData.username}</span>
            <button id="wishlistBtn" class="btn">Wishlist</button>
            <button id="cartBtn" class="btn">Cart (<span id="cartCount">0</span>)</button>
            <button id="dashboardBtn" class="btn">Dashboard</button>
            <button id="logoutBtn" class="btn">Logout</button>
        `;
        
        // Add admin dashboard button if user is admin
        if (userData.role === 'admin') {
            buttonsHTML = `
                <span class="welcome-user">${userData.username} (Admin)</span>
                <button id="wishlistBtn" class="btn">Wishlist</button>
                <button id="cartBtn" class="btn">Cart (<span id="cartCount">0</span>)</button>
                <button id="dashboardBtn" class="btn">Dashboard</button>
                <button id="adminDashboardBtn" class="btn">Admin Dashboard</button>
                <button id="logoutBtn" class="btn">Logout</button>
            `;
        }
        
        authButtons.innerHTML = buttonsHTML;
        
        // Update cart count
        updateCartCount();
        
        // Add event listeners for new buttons
        setTimeout(() => {
            if (document.getElementById('wishlistBtn')) {
                document.getElementById('wishlistBtn').addEventListener('click', () => {
                    window.location.href = 'wishlist.html';
                });
            }
            
            if (document.getElementById('cartBtn')) {
                document.getElementById('cartBtn').addEventListener('click', () => {
                    window.location.href = 'cart.html';
                });
            }
            
            if (document.getElementById('dashboardBtn')) {
                document.getElementById('dashboardBtn').addEventListener('click', () => {
                    window.location.href = 'dashboard.html';
                });
            }
            
            if (document.getElementById('adminDashboardBtn')) {
                document.getElementById('adminDashboardBtn').addEventListener('click', () => {
                    window.location.href = 'admin-dashboard.html';
                });
            }
            
            if (document.getElementById('logoutBtn')) {
                document.getElementById('logoutBtn').addEventListener('click', logout);
            }
        }, 100);
    }
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

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminLoggedIn');
    window.location.reload();
}

// Show login modal
function showLoginModal() {
    loginModal.style.display = 'flex';
}

// Show register modal
function showRegisterModal() {
    registerModal.style.display = 'flex';
}

// Close modals
function closeModals() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
}

// Switch to register form
function switchToRegisterForm() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'flex';
}

// Switch to login form
function switchToLoginForm() {
    registerModal.style.display = 'none';
    loginModal.style.display = 'flex';
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        // Try to login through API first
        if (window.API && typeof window.API.login === 'function') {
            const user = await window.API.login(username, password);
            // Save current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Handle role-based redirection
            if (user.role === 'admin') {
                // Set admin logged in flag
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin-dashboard.html';
            } else {
                // Remove admin logged in flag if it exists
                localStorage.removeItem('adminLoggedIn');
                window.location.href = 'dashboard.html';
            }
            
            // Close modal
            closeModals();
        } else {
            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // Save current user
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Handle role-based redirection
                if (user.role === 'admin') {
                    // Set admin logged in flag
                    localStorage.setItem('adminLoggedIn', 'true');
                    window.location.href = 'admin-dashboard.html';
                } else {
                    // Remove admin logged in flag if it exists
                    localStorage.removeItem('adminLoggedIn');
                    window.location.href = 'dashboard.html';
                }
                
                // Close modal
                closeModals();
            } else {
                alert('Invalid credentials. Please try again.');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        // Try to register through API first
        if (window.API && typeof window.API.register === 'function') {
            const userData = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: password
            };
            
            const user = await window.API.register(userData);
            
            alert('Registration successful! Please login.');
            
            // Switch to login form
            switchToLoginForm();
        } else {
            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if username already exists
            if (users.some(u => u.username === username)) {
                alert('Username already exists');
                return;
            }
            
            // Create new user (default role is user)
            const newUser = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: password,
                role: 'user', // Default role is user
                memberSince: new Date().toLocaleDateString()
            };
            
            // Add new user to users array
            users.push(newUser);
            
            // Save users to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Registration successful! Please login.');
            
            // Switch to login form
            switchToLoginForm();
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
    }
}

// Add to wishlist
function addToWishlist(flowerId) {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        alert('Please login to add items to your wishlist');
        showLoginModal();
        return;
    }
    
    const userData = JSON.parse(user);
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userData.username}`)) || [];
    
    // Check if item is already in wishlist
    if (wishlist.includes(flowerId)) {
        alert('This item is already in your wishlist');
        return;
    }
    
    wishlist.push(flowerId);
    localStorage.setItem(`wishlist_${userData.username}`, JSON.stringify(wishlist));
    alert('Added to wishlist!');
}

// Add to cart
async function addToCart(flowerId) {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        alert('Please login to add items to your cart');
        showLoginModal();
        return;
    }
    
    try {
        // Get flowers from API or localStorage
        const flowers = await getFlowers();
        const flower = flowers.find(f => f.id == flowerId);
        
        if (!flower) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id == flowerId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: flower.id,
                name: flower.name,
                price: parseFloat(flower.price),
                image: flower.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart');
    }
}

// Display products
async function displayProducts() {
    if (!productGrid) return;
    
    try {
        // Get flowers from API or generate
        let flowers = await getFlowers();
        
        // Apply search filter (if on index.html or products.html)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                flowers = flowers.filter(flower => 
                    flower.name.toLowerCase().includes(searchTerm) ||
                    flower.description.toLowerCase().includes(searchTerm)
                );
            }
        }
        
        // Apply category filter (if on index.html or products.html)
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            const category = categoryFilter.value;
            if (category) {
                flowers = flowers.filter(flower => flower.category === category);
            }
        }
        
        // Apply sorting (if on index.html or products.html)
        const sortOrder = document.getElementById('sortOrder');
        if (sortOrder) {
            const order = sortOrder.value;
            switch (order) {
                case 'price-low':
                    flowers.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    flowers.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                default:
                    flowers.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }
        }
        
        productGrid.innerHTML = '';
        
        if (flowers.length === 0) {
            productGrid.innerHTML = '<p>No products found matching your criteria.</p>';
            return;
        }
        
        flowers.forEach(flower => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Use a flower icon instead of images
            const flowerIcon = getFlowerIcon(flower.category);
            
            productCard.innerHTML = `
                <div class="product-image">
                    <i class="${flowerIcon}"></i>
                </div>
                <div class="product-info">
                    <h3>${flower.name}</h3>
                    <p>${flower.description}</p>
                    <div class="price">₹${parseFloat(flower.price).toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn btn-outline" onclick="addToWishlist(${flower.id})"> 
                            <i class="fas fa-heart"></i> Wishlist
                        </button>
                        <button class="btn btn-primary" onclick="window.location.href='product-detail.html?id=${flower.id}'"> 
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-primary" onclick="addToCart(${flower.id})"> 
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error displaying products:', error);
        productGrid.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

// Initialize the app
async function init() {
    try {
        // Load products
        await displayProducts();
        
        // Check login status
        checkLoginStatus();
        
        // Event listeners
        if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
        if (registerBtn) registerBtn.addEventListener('click', showRegisterModal);
        
        // Form submissions
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (registerForm) registerForm.addEventListener('submit', handleRegister);
        
        // Close buttons
        if (closeButtons) {
            closeButtons.forEach(button => {
                button.addEventListener('click', closeModals);
            });
        }
        
        // Switch form links
        if (switchToRegister) switchToRegister.addEventListener('click', switchToRegisterForm);
        if (switchToLogin) switchToLogin.addEventListener('click', switchToLoginForm);
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === loginModal) {
                closeModals();
            }
            if (event.target === registerModal) {
                closeModals();
            }
        });
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Function to get appropriate flower icon based on category
function getFlowerIcon(category) {
    const iconMap = {
        "Rose": "fas fa-rose",
        "Tulip": "fas fa-seedling",
        "Sunflower": "fas fa-sun",
        "Lily": "fas fa-feather-alt",
        "Orchid": "fas fa-wind",
        "Daisy": "fas fa-leaf",
        "Carnation": "fas fa-pagelines",
        "Peony": "fas fa-spa",
        "Hydrangea": "fas fa-cloud",
        "Daffodil": "fas fa-star",
        "Chrysanthemum": "fas fa-asterisk",
        "Poppy": "fas fa-apple-alt",
        "Lavender": "fas fa-air-freshener",
        "Jasmine": "fas fa-moon",
        "Gardenia": "fas fa-circle",
        "Camellia": "fas fa-dot-circle",
        "Azalea": "fas fa-ring",
        "Begonia": "fas fa-heart",
        "Marigold": "fas fa-fire",
        "Zinnia": "fas fa-splotch",
        "Cosmos": "fas fa-meteor",
        "Snapdragon": "fas fa-sort-up",
        "Foxglove": "fas fa-hand-point-up",
        "Delphinium": "fas fa-water",
        "Lisianthus": "fas fa-mountain",
        "Freesia": "fas fa-wind",
        "Gladiolus": "fas fa-sword",
        "Alstroemeria": "fas fa-archway",
        "Statice": "fas fa-anchor",
        "Limonium": "fas fa-lemon",
        "Eucalyptus": "fas fa-tree",
        "Ranunculus": "fas fa-radiation",
        "Anemone": "fas fa-wind",
        "Sweet Pea": "fas fa-peapod",
        "Stock": "fas fa-align-center",
        "Celosia": "fas fa-feather",
        "Buddleia": "fas fa-bug",
        "Heather": "fas fa-mound",
        "Protea": "fas fa-egg",
        "Bird of Paradise": "fas fa-dove",
        "Calla Lily": "fas fa-shoe-prints",
        "Gerbera Daisy": "fas fa-dizzy",
        "Cherry Blossom": "fas fa-chess-pawn",
        "Magnolia": "fas fa-medal",
        "Hibiscus": "fas fa-hockey-puck",
        "default": "fas fa-seedling"
    };
    
    // Return specific icon or default
    return iconMap[category] || iconMap.default;
}
