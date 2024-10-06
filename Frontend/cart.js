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
                    <p class="cart-item-price">$${item.totalPrice.toFixed(2)}</p>
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
document.getElementById('proceed-checkout').addEventListener('click', () => {
    checkoutForm.style.display = 'block';
    checkoutSection.style.display = 'none';
});

// Handle user detail submission
checkoutDetailsForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;

    // Store user details (for demonstration purposes, we store it in localStorage)
    const userDetails = { name, address, phone };
    localStorage.setItem('userDetails', JSON.stringify(userDetails));

    // Hide form and show checkout
    checkoutForm.style.display = 'none';
    checkoutSection.style.display = 'block';

    alert("Details submitted! You can now proceed with payment.");
});

// Handle "Pay Now" button click
document.getElementById('pay-button').addEventListener('click', () => {
    alert("Payment successful!");
    cart = [];
    localStorage.removeItem('cart');
    renderCartItems();
});

// Render cart items on page load
renderCartItems();
