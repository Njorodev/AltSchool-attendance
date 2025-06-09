document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart object to store items
  const cart = {};

  // References to elements in the DOM
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  const cartCountEl = document.getElementById('cart-count');
  const dessertList = document.querySelector('.dessert-list');

  // Popup elements for confirming an order
  const confirmBtn = document.getElementById('confirm-btn');
  const popup = document.getElementById('order-popup');
  const popupClose = document.getElementById('popup-close');
  const popupItems = document.getElementById('popup-items');
  const popupTotal = document.getElementById('popup-total');
  const startNewOrder = document.getElementById('start-new-order');

const updateCart = () => {
  cartItemsContainer.innerHTML = '';
  let totalQuantity = 0;
  let totalPrice = 0;

  for (const name in cart) {
    const item = cart[name];
    const itemTotal = item.quantity * item.price;
    totalQuantity += item.quantity;
    totalPrice += itemTotal;

    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.quantity}x</strong> ${name} <br>
      <span style="color: gray;">@ $${item.price.toFixed(2)}</span>
      &nbsp; <strong>$${itemTotal.toFixed(2)}</strong>
    `;
    cartItemsContainer.appendChild(li);
  }

  totalPriceEl.textContent = totalPrice.toFixed(2);
  cartCountEl.textContent = totalQuantity;

  // Toggle empty cart display
  document.getElementById('empty-cart').style.display = totalQuantity === 0 ? 'block' : 'none';

  // Hide cart content when empty, show when items are added
  document.getElementById('cart-content').style.display = totalQuantity === 0 ? 'none' : 'block';

  // Hide confirm button when cart is empty, show when items are added
  confirmBtn.style.display = totalQuantity === 0 ? 'none' : 'block';
};

  // Renders the correct button UI based on item quantity
  const renderButtons = (dessertItemElement) => {
    const name = dessertItemElement.querySelector('h3').textContent;
    const price = parseFloat(dessertItemElement.querySelector('.price').textContent.replace('$', ''));
    const buttonContainer = dessertItemElement.querySelector('.add-btn');

    // If item is not in the cart, show "Add to Cart" button
    if (!cart[name] || cart[name].quantity === 0) {
      buttonContainer.innerHTML = 'Add to Cart';
      buttonContainer.classList.remove('qty-controls');
    } else {
      // If item exists, show quantity adjustment buttons
      buttonContainer.innerHTML = `
        <button class="qty-btn decrease-btn" data-name="${name}">-</button>
        <span>${cart[name].quantity}</span>
        <button class="qty-btn increase-btn" data-name="${name}">+</button>
      `;
      buttonContainer.classList.add('qty-controls');
    }
  };

  // Initialize button UI for all dessert items
  document.querySelectorAll('.dessert-item').forEach(item => {
    renderButtons(item);
  });

  // Event handling for adding items to the cart
  dessertList.addEventListener('click', (event) => {
    const target = event.target;

    // Add item to cart when "Add to Cart" is clicked
    if (target.classList.contains('add-btn') && target.textContent === 'Add to Cart') {
      const dessertItem = target.closest('.dessert-item');
      const name = dessertItem.querySelector('h3').textContent;
      const price = parseFloat(dessertItem.querySelector('.price').textContent.replace('$', ''));

      cart[name] = { price, quantity: 1 };
      renderButtons(dessertItem);
      updateCart();
    }

    // Increase item quantity
    if (target.classList.contains('increase-btn')) {
      const name = target.dataset.name;
      if (cart[name]) {
        cart[name].quantity++;
        const dessertItem = target.closest('.dessert-item');
        renderButtons(dessertItem);
        updateCart();
      }
    }

    // Decrease item quantity or remove item if quantity reaches 0
    if (target.classList.contains('decrease-btn')) {
      const name = target.dataset.name;
      if (cart[name]) {
        cart[name].quantity--;
        if (cart[name].quantity <= 0) {
          delete cart[name];
        }
        const dessertItem = target.closest('.dessert-item');
        renderButtons(dessertItem);
        updateCart();
      }
    }
  });

  // Handles the order confirmation popup display
  confirmBtn.addEventListener('click', () => {
    popupItems.innerHTML = '';
    let total = 0;

    // Display ordered items in the popup
    for (const name in cart) {
      const item = cart[name];
      const subtotal = item.quantity * item.price;
      total += subtotal;

      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${name}</strong><br>
        ${item.quantity}x @ $${item.price.toFixed(2)} = $${subtotal.toFixed(2)}
      `;
      popupItems.appendChild(li);
    }

    // Show total price and display popup
    popupTotal.textContent = total.toFixed(2);
    popup.style.display = 'flex';
  });

  // Close the popup when "X" button is clicked
  popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // Reset cart when "Start New Order" is clicked
  startNewOrder.addEventListener('click', () => {
    for (const name in cart) {
      delete cart[name];
    }
    updateCart();

    // Re-render buttons for a fresh state
    document.querySelectorAll('.dessert-item').forEach(item => {
      renderButtons(item);
    });

    // Hide popup
    popup.style.display = 'none';
  });
});
