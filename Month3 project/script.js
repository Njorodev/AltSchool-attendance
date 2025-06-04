document.addEventListener('DOMContentLoaded', () => {
  const cart = {};
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  const cartCountEl = document.getElementById('cart-count');
  const dessertList = document.querySelector('.dessert-list');

  // Popup elements
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
  };

  const renderButtons = (dessertItemElement) => {
    const name = dessertItemElement.querySelector('h3').textContent;
    const price = parseFloat(dessertItemElement.querySelector('.price').textContent.replace('$', ''));
    const buttonContainer = dessertItemElement.querySelector('.add-btn');

    if (!cart[name] || cart[name].quantity === 0) {
      buttonContainer.innerHTML = 'Add to Cart';
      buttonContainer.classList.remove('qty-controls');
    } else {
      buttonContainer.innerHTML = `
        <button class="qty-btn decrease-btn" data-name="${name}">-</button>
        <span>${cart[name].quantity}</span>
        <button class="qty-btn increase-btn" data-name="${name}">+</button>
      `;
      buttonContainer.classList.add('qty-controls');
    }
  };

  // Initialize buttons
  document.querySelectorAll('.dessert-item').forEach(item => {
    renderButtons(item);
  });

  // Event delegation
  dessertList.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('add-btn') && target.textContent === 'Add to Cart') {
      const dessertItem = target.closest('.dessert-item');
      const name = dessertItem.querySelector('h3').textContent;
      const price = parseFloat(dessertItem.querySelector('.price').textContent.replace('$', ''));

      cart[name] = { price, quantity: 1 };
      renderButtons(dessertItem);
      updateCart();
    }

    if (target.classList.contains('increase-btn')) {
      const name = target.dataset.name;
      if (cart[name]) {
        cart[name].quantity++;
        const dessertItem = target.closest('.dessert-item');
        renderButtons(dessertItem);
        updateCart();
      }
    }

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

  // Confirm Order functionality
  confirmBtn.addEventListener('click', () => {
    popupItems.innerHTML = '';
    let total = 0;

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

    popupTotal.textContent = total.toFixed(2);
    popup.style.display = 'flex';
  });

  popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  startNewOrder.addEventListener('click', () => {
    // Reset cart
    for (const name in cart) {
      delete cart[name];
    }
    updateCart();

    // Re-render buttons
    document.querySelectorAll('.dessert-item').forEach(item => {
      renderButtons(item);
    });

    popup.style.display = 'none';
  });
});
