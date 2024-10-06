let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add item to cart
function addToCart(sneakerItem) {
    const existingItem = cart.find(item => item.id === sneakerItem.id);
    if (!existingItem) {
        cart.push({
            id: sneakerItem.id,
            name: sneakerItem.name,
            image: sneakerItem.image,
            price: parseFloat(sneakerItem.price),
            quantity: 1,
            totalPrice: parseFloat(sneakerItem.price)
        });
    } else {
        existingItem.quantity++;
        existingItem.totalPrice += existingItem.price;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${sneakerItem.name} has been added to your cart!`);
}

// Event listeners for Buy Now buttons
document.querySelectorAll('.btnBuy').forEach(button => {
    button.addEventListener("click", function() {
        const sneakerItem = {
            id: this.getAttribute('data-id'),
            name: this.getAttribute('data-name'),
            image: this.getAttribute('data-image'),
            price: this.getAttribute('data-price')
        };
        addToCart(sneakerItem);
    });
});

// Checkout button logic
document.getElementById('checkout-button').addEventListener('click', function() {
    window.location.href = "cart.html"; // Redirect to cart page on checkout
});
