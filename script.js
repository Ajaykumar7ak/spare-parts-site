document.addEventListener("DOMContentLoaded", () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
        const icon = darkModeToggle.querySelector("i");
        if (icon) {
            darkModeToggle.addEventListener("click", () => {
                document.body.classList.toggle("dark-mode");
                localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
                icon.classList.toggle("fa-moon");
                icon.classList.toggle("fa-sun");
            });

            if (localStorage.getItem("darkMode") === "true") {
                document.body.classList.add("dark-mode");
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            }
        }
    }

    // Sample Products Data
    const products = [
        { 
            id: 1,
            name: "Brake Pads", 
            price: 25, 
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrzisY8T-3k4q-p68FIIwwvaJG-05dctvqvg&s",
            category: "brakes",
            description: "High-quality brake pads for optimal stopping power"
        },
        { 
            id: 2,
            name: "Engine Oil", 
            price: 15, 
            image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQXVqM6ePLwNh47v42LN6kzCHqkorCAGi4xbRtNFfep9WeweRyPH8kEpatQaYpy_pzFqihRPOUehgSMLFaH4-S7M7HGzV08Cz92_GVoynZfrslhKU_vVlTVZsw",
            category: "engine",
            description: "Premium engine oil for smooth performance"
        },
        { 
            id: 3,
            name: "Chain Kit", 
            price: 40, 
            image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQhCERm7dbT8IhWgdl7k8ZDIovRQlji0RIsu2SBWTB2nGeUJyML-m2K0XarslrmPtWAgY0Ucyi18R0k-BVjaqQduqJ1cRQt6R8YDiI2zCYnNhfNtY1C9NM0",
            category: "engine",
            description: "Complete chain kit for reliable power transmission"
        },
        { 
            id: 4,
            name: "Spark Plug", 
            price: 10, 
            image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR9F13LkjasDt0K2wI0Rjb3LXaF9qmNVVJNZfcs8si7FqYj9QPD_mvik04QpHt3rI2oV5vWZgyqTNeM8hCu7E-tPkShWeZV2wq5aPMunMpwUa_uHnevOkh1",
            category: "engine",
            description: "High-performance spark plug for better ignition"
        },
        {
            id: 5,
            name: "LED Headlight",
            price: 35,
            image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQYEV40h68U6RV66sFJjFZnksq59JxyZl1D4oubV1twk2IFXkokRv0Cek6jUIKFp0sAn-LHwr_rZGZQkDP8--7SY0h08sXsRaVMeIsc6TmynKeUlnrua-69",
            category: "lights",
            description: "Bright LED headlight for better visibility"
        },
        {
            id: 6,
            name: "Tire Set",
            price: 120,
            image: "https://www.theengineerspost.com/wp-content/uploads/2022/08/Bike-Engine-Parts.jpg",
            category: "tires",
            description: "Set of premium tires for optimal grip"
        }
    ];

    // Cart State
    let cart = [];
    try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            // Filter out any null or invalid items
            cart = parsedCart.filter(item => item && typeof item === 'object' && item.id);
        }
    } catch (error) {
        console.warn("Error loading cart from localStorage:", error);
        cart = [];
    }
    
    let filteredProducts = [...products];

    // Search Functionality
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (searchInput && searchBtn) {
        function handleSearch() {
            const searchTerm = searchInput.value.toLowerCase();
            filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
            renderProducts();
        }

        searchInput.addEventListener("input", handleSearch);
        searchBtn.addEventListener("click", handleSearch);
    }

    // Filter Functionality
    const priceFilter = document.getElementById("price-filter");
    const sortFilter = document.getElementById("sort-filter");

    if (priceFilter && sortFilter) {
        function handleFilters() {
            let filtered = [...products];
            
            // Apply price filter
            const priceRange = priceFilter.value;
            if (priceRange) {
                const [min, max] = priceRange.split("-").map(Number);
                filtered = filtered.filter(product => {
                    if (max) {
                        return product.price >= min && product.price <= max;
                    } else {
                        return product.price >= min;
                    }
                });
            }

            // Apply sort
            const sortBy = sortFilter.value;
            if (sortBy) {
                filtered.sort((a, b) => {
                    switch (sortBy) {
                        case "price-low":
                            return a.price - b.price;
                        case "price-high":
                            return b.price - a.price;
                        case "name":
                            return a.name.localeCompare(b.name);
                        default:
                            return 0;
                    }
                });
            }

            filteredProducts = filtered;
            renderProducts();
        }

        priceFilter.addEventListener("change", handleFilters);
        sortFilter.addEventListener("change", handleFilters);
    }

    // Category Filter
    const categoryCards = document.querySelectorAll(".category-card");
    if (categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener("click", () => {
                const category = card.dataset.category;
                filteredProducts = category ? 
                    products.filter(product => product.category === category) : 
                    [...products];
                renderProducts();
                
                // Update active state
                categoryCards.forEach(c => c.classList.remove("active"));
                card.classList.add("active");
            });
        });
    }

    // Render Products
    function renderProducts() {
        const productGrid = document.querySelector(".product-grid");
        if (!productGrid) return;

        productGrid.innerHTML = "";

        filteredProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description}</p>
                    <p class="price">₹${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });

        // Add event listeners to new buttons
        const addToCartButtons = document.querySelectorAll(".add-to-cart");
        addToCartButtons.forEach(button => {
            button.onclick = function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                }
            };
        });
    }

    function addToCart(product) {
        try {
            // Check if product already exists in cart
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartUI();
            showToast(`${product.name} added to cart!`);
        } catch (error) {
            console.warn("Error adding to cart:", error);
            showToast("Error adding item to cart");
        }
    }

    function updateCartUI() {
        const cartItems = document.querySelector(".cart-items");
        const cartCount = document.querySelector(".cart-count");
        const totalAmount = document.querySelector(".total-amount");

        if (!cartItems || !cartCount || !totalAmount) return;

        try {
            // Update cart count with total items (including quantities)
            const totalItems = cart.reduce((sum, item) => {
                if (!item) return sum;
                return sum + (item.quantity || 1);
            }, 0);
            cartCount.textContent = totalItems;

            // Update cart items
            cartItems.innerHTML = "";
            if (!cart || cart.length === 0) {
                cartItems.innerHTML = "<p>No items in the cart.</p>";
            } else {
                cart.forEach((item, index) => {
                    if (!item) return; // Skip null items
                    
                    const cartItem = document.createElement("div");
                    cartItem.classList.add("cart-item");
                    cartItem.innerHTML = `
                        <div class="cart-item-details">
                            <h4>${item.name || 'Unknown Item'}</h4>
                            <p>$${(item.price || 0).toFixed(2)}</p>
                            <div class="quantity-controls">
                                <button class="quantity-btn minus" data-index="${index}">-</button>
                                <span class="quantity">${item.quantity || 1}</span>
                                <button class="quantity-btn plus" data-index="${index}">+</button>
                            </div>
                            <p class="item-total">Total: $${(((item.price || 0) * (item.quantity || 1))).toFixed(2)}</p>
                        </div>
                        <button class="remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    cartItems.appendChild(cartItem);
                });

                // Add event listeners to remove buttons
                document.querySelectorAll(".remove-item").forEach(button => {
                    button.onclick = function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        removeFromCart(index);
                    };
                });

                // Add event listeners to quantity buttons
                document.querySelectorAll(".quantity-btn").forEach(button => {
                    button.onclick = function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        const change = this.classList.contains("plus") ? 1 : -1;
                        updateQuantity(index, change);
                    };
                });
            }

            // Update total amount with null checks
            const total = cart.reduce((sum, item) => {
                if (!item) return sum;
                return sum + ((item.price || 0) * (item.quantity || 1));
            }, 0);
            totalAmount.textContent = `$${total.toFixed(2)}`;
        } catch (error) {
            console.warn("Error updating cart UI:", error);
            showToast("Error updating cart");
        }
    }

    function removeFromCart(index) {
        try {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartUI();
            showToast("Item removed from cart");
        } catch (error) {
            console.warn("Error removing from cart:", error);
            showToast("Error removing item from cart");
        }
    }

    function updateQuantity(index, change) {
        try {
            const item = cart[index];
            if (item) {
                item.quantity = Math.max(1, (item.quantity || 1) + change);
                if (item.quantity === 0) {
                    removeFromCart(index);
                } else {
                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateCartUI();
                }
            }
        } catch (error) {
            console.warn("Error updating quantity:", error);
            showToast("Error updating quantity");
        }
    }

    function clearCart() {
        try {
            if (cart.length === 0) {
                showToast("Cart is already empty!");
                return;
            }
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartUI();
            showToast("Cart cleared");
        } catch (error) {
            console.warn("Error clearing cart:", error);
            showToast("Error clearing cart");
        }
    }

    // Toast Notification
    function showToast(message) {
        const toast = document.getElementById("toast");
        if (!toast) return;
        
        try {
            toast.textContent = message;
            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        } catch (error) {
            console.warn("Error showing toast:", error);
        }
    }

    // Contact Form
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            try {
                const name = document.getElementById("name")?.value || "";
                const email = document.getElementById("email")?.value || "";
                const message = document.getElementById("message")?.value || "";

                // Here you would typically send the form data to a server
                showToast("Message sent successfully!");
                contactForm.reset();
            } catch (error) {
                console.warn("Error submitting contact form:", error);
                showToast("Error sending message");
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize
    renderProducts();
    updateCartUI();

    // Clear cart button
    const clearCartBtn = document.querySelector(".clear-cart");
    if (clearCartBtn) {
        clearCartBtn.onclick = clearCart;
    }

    // Checkout button
    const checkoutBtn = document.querySelector(".checkout");
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) {
                showToast("Your cart is empty!");
                return;
            }
            showToast("Proceeding to checkout...");
        };
    }
});
