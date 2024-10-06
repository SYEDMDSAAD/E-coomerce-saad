document.addEventListener('DOMContentLoaded', () => {
    // Fetch cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items1');
    let finalPriceElement = document.getElementById('final-price');
    let checkoutSection = document.getElementById('checkout-section');
    let checkoutForm = document.getElementById('checkout-form');
    let checkoutDetailsForm = document.getElementById('checkout-details-form');

    // Function to render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear current content

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            checkoutSection.style.display = 'none';
            return;
        }

        let totalPrice = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item1');

            totalPrice += item.totalPrice;

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div>
                        <p class="cart-item-name">${item.name}</p>
                        <p>Size: ${item.size}</p>
                        <p class="cart-item-price">₹${item.totalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input">
                        <select class="select-size" data-index="${index}">
                            <option value="6" ${item.size == 6 ? 'selected' : ''}>Size 6</option>
                            <option value="7" ${item.size == 7 ? 'selected' : ''}>Size 7</option>
                            <option value="8" ${item.size == 8 ? 'selected' : ''}>Size 8</option>
                            <option value="9" ${item.size == 9 ? 'selected' : ''}>Size 9</option>
                        </select>
                        <button class="btn-remove" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        finalPriceElement.textContent = totalPrice.toFixed(2);
        checkoutSection.style.display = 'block';

        addEventListeners();
    }

    // Function to handle remove button
    function addEventListeners() {
        const removeButtons = document.querySelectorAll('.btn-remove');
        const quantityInputs = document.querySelectorAll('.quantity-input');
        const sizeSelectors = document.querySelectorAll('.select-size');

        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                removeFromCart(index);
            });
        });

        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                const index = this.getAttribute('data-index');
                updateQuantity(index, this.value);
            });
        });

        sizeSelectors.forEach(select => {
            select.addEventListener('change', function() {
                const index = this.getAttribute('data-index');
                updateSize(index, this.value);
            });
        });
    }

    // Function to remove item from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    // Function to update item quantity
    function updateQuantity(index, newQuantity) {
        newQuantity = parseInt(newQuantity);
        if (newQuantity < 1) return;

        cart[index].quantity = newQuantity;
        cart[index].totalPrice = newQuantity * cart[index].price;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    // Function to update size of an item
    function updateSize(index, newSize) {
        cart[index].size = newSize;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    // Handle "Proceed to Checkout" button click
    const proceedButton = document.getElementById('proceed-checkout');
    if (proceedButton) {
        proceedButton.addEventListener('click', () => {
            checkoutForm.style.display = 'block';
            checkoutSection.style.display = 'none';
        });
    }

    // Handle user detail submission
    checkoutDetailsForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;

        // Validate user details before proceeding
        if (!name || !address || !phone) {
            alert('Please fill in all details (Name, Address, Phone).');
            return;
        }

        // Store user details (for demonstration purposes, we store it in localStorage)
        const userDetails = { name, address, phone };
        localStorage.setItem('userDetails', JSON.stringify(userDetails));

        // Hide form and show checkout
        checkoutForm.style.display = 'none';
        checkoutSection.style.display = 'block';

        alert("Details submitted! You can now proceed with payment.");
    });

    // Handle "Pay Now" button click
    const payButton = document.getElementById('pay-button');
    if (payButton) {
        payButton.addEventListener('click', () => {
            const totalPrice = parseFloat(finalPriceElement.textContent) * 100; // Convert to paise

            // Fetch user details from localStorage
            const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
            const { name = '', phone = '', address = '' } = userDetails; // Default to empty strings if not found

            // Check if user details are filled
            if (!name || !phone || !address) {
                alert('Please fill in your details before proceeding to payment.');
                return;
            }

            // Create a Razorpay order
            fetch('https://ecommerce-backend-1-io1h.onrender.com/create-order', { // Updated backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: totalPrice, // Amount in paise
                    currency: 'INR',
                    receipt: 'receipt#1'
                })
            })
            .then(response => response.json())
            .then(orderData => {
                const options = {
                    key: 'rzp_test_Im5oO7IbZtGD9n', // Your Razorpay key ID
                    amount: orderData.amount, // Amount in paise
                    currency: orderData.currency,
                    name: 'Modern Sneaker Store',
                    description: 'Test Transaction',
                    image: 'imgs/2.8.webp',
                    order_id: orderData.id, // Order ID generated by Razorpay
                    handler: function(response) {
                        const payment_id = response.razorpay_payment_id;
                        const order_id = response.razorpay_order_id;
                        const signature = response.razorpay_signature;

                        // Send this data to your backend for verification
                        fetch('https://ecommerce-backend-1-io1h.onrender.com/verify-payment', { // Updated backend URL
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                razorpay_payment_id: payment_id,
                                razorpay_order_id: order_id,
                                razorpay_signature: signature
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert('Payment Verified Successfully!');
                                cart = []; // Clear the cart
                                localStorage.removeItem('cart'); // Remove from localStorage
                                renderCartItems(); // Re-render cart items
                            } else {
                                alert('Payment Verification Failed!');
                            }
                        })
                        .catch(error => {
                            console.error('Error verifying payment:', error);
                        });
                    },
                    prefill: {
                        name: name, // Use fetched name
                        contact: phone, // Use fetched phone
                        address: address // Use fetched address
                    },
                    notes: {
                        address: address // Use fetched address
                    },
                    theme: {
                        color: '#F37254'
                    }
                };

                // Open the Razorpay checkout with the options
                const razorpay = new Razorpay(options);
                razorpay.open();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // Initial render of cart items
    renderCartItems();
});
