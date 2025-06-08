// GLOBAL CART STATE
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// UPDATE CART UI FUNCTION
function updateCartUI() {
  const cartList = document.getElementById('cart-items');
  const cartAmt = document.querySelector('.cartAmt p');
  const totalDisplay = document.getElementById('cart-total');

  cartList.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <span>${item.name}</span>
      <div class="d-flex align-items-center">
        <strong>R ${(item.price * item.quantity).toLocaleString()}</strong>
        <div class="quantity ms-2">
          <input type="button" class="btn btn-sm btn-outline-secondary decrease-qty" data-index="${index}" value=" - ">
          <span class="mx-2">${item.quantity}</span>
          <input type="button" class="btn btn-sm btn-outline-secondary increase-qty" data-index="${index}" value=" + ">
        </div>
        <button class="btn btn-sm btn-danger ms-2 remove-item" data-index="${index}">Remove</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  totalDisplay.textContent = 'R ' + total.toLocaleString();
  cartAmt.textContent = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// EVENT DELEGATION FOR CART BUTTONS

// Modal cart quantity and remove buttons
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('remove-item')) {
    const index = e.target.getAttribute('data-index');
    cart.splice(index, 1);
    updateCartUI();
  }

  if (e.target.classList.contains('increase-qty')) {
    const index = e.target.getAttribute('data-index');
    cart[index].quantity += 1;
    updateCartUI();
  }

  if (e.target.classList.contains('decrease-qty')) {
    const index = e.target.getAttribute('data-index');
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    updateCartUI();
  }
});

//  MANUAL QUANTITY SELECTORS NEAR BOOK NOW BUTTONS
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('increase-manual')) {
    const span = e.target.parentElement.querySelector('.manual-qty');
    span.textContent = parseInt(span.textContent) + 1;
  }
  if (e.target.classList.contains('decrease-manual')) {
    const span = e.target.parentElement.querySelector('.manual-qty');
    const current = parseInt(span.textContent);
    if (current > 1) span.textContent = current - 1;
  }
});

//  BOOK NOW BUTTON HANDLER (reads nearby quantity)
document.querySelectorAll('.book-now-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('data-name');
    const price = parseFloat(btn.getAttribute('data-price'));
    const container = btn.closest('.trip-container') || btn.parentElement;
    const qtySpan = container.querySelector('.manual-qty');
    const quantity = qtySpan ? parseInt(qtySpan.textContent) : 1;

    if (!name || isNaN(price)) return;

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ name, price, quantity });
    }
    updateCartUI();
  });
});

// SHOW MODAL ONLY FROM VIEW CART / Checkout section
const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
['.view-cart-btn', '.fa-basket-shopping', '.checkout-btn'].forEach(selector => {
  document.querySelectorAll(selector).forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      modal.show();
    });
  });
});

// Initial ON LOAD of web
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

});


// cart reset
 document.addEventListener('DOMContentLoaded', function () {
  const checkoutBtn = document.querySelector('.checkout-btn');
  const cartItemsList = document.querySelector('#cart-items');
  const cartCount = document.querySelector('.cart-count');
  const cartTotal = document.querySelector('#cart-total');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function (event) {
      event.preventDefault();

      const cartItems = cartItemsList.querySelectorAll('li');

      if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
      }

      alert('Checkout successful! Thank you for your purchase.');

      // Clear cart visually
      cartItemsList.innerHTML = '';
      if (cartCount) cartCount.textContent = '0';
      if (cartTotal) cartTotal.textContent = 'R 0';

      // Optionally clear cart from localStorage
      localStorage.removeItem('cart');

      // Close the modal (optional, if using Bootstrap)
      const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
      if (modal) modal.hide();
    });
  }
});

//filter system

function filterTrips(filter) {
  const cards = document.querySelectorAll('.trips-card');
  cards.forEach(card => {
    if (filter === 'all' || card.classList.contains(filter)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const filterIcon = document.querySelector('.fa-sliders');
  const filterPanel = document.getElementById('filterPanel');

  // Toggle filter panel
  filterIcon.addEventListener('click', () => {
    filterPanel.style.display = filterPanel.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('applyFilters').addEventListener('click', () => {
    const sortBy = document.getElementById('sortBy').value;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value);
    const region = document.getElementById('regionFilter').value;

    let trips = Array.from(document.querySelectorAll('.trip-card'));

    // Filter
    trips.forEach(card => {
      const price = parseFloat(card.getAttribute('data-price'));
      const regionData = card.getAttribute('data-region');

      let show = true;

      if (!isNaN(maxPrice) && price > maxPrice) show = false;
      if (region && region !== regionData) show = false;

      card.style.display = show ? 'block' : 'none';
    });

    // Sort
    if (sortBy) {
      const container = trips[0].parentElement; // Assuming they all live in same parent (which they are in currently)
      const visibleTrips = trips.filter(trip => trip.style.display !== 'none');

      visibleTrips.sort((a, b) => {
        if (sortBy === 'name') {
          return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
        } else if (sortBy === 'price') {
          return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
        }
      });

      // Re-append sorted items
      visibleTrips.forEach(trip => container.appendChild(trip));
    }
  });
});

//Search bar

const data = ['Mars Adventure', 'Saturn Rings Tour', 'The Giants Jupiters Journey', 'Neptunes Cosmic Dive', 'Uranus Uncharted', 'Moonlight Meander'];

function handleSearch() {
    const query = document.querySelector('.form-control').value.trim();
    if (query) {
      const encoded = encodeURIComponent(query);
      window.location.href = '/pages/flights.html?search=' + encoded;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector('.form-control');
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');

    if (searchQuery) {
      const cards = document.querySelectorAll('[data-name]');
      const lowerQuery = searchQuery.toLowerCase();

      let found = false;
      cards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        if (name.includes(lowerQuery)) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.outline = '3px solid #ffcc00';
          setTimeout(() => card.style.outline = 'none', 2000);
          found = true;
        }
      });

      if (!found) {
        alert('No trip found matching: ' + searchQuery);
      }
    }
  });

 //contacts page form

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccess');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = form.querySelector('input[name="firstName"]').value;
      const email = form.querySelector('input[type="email"]').value;
      const message = form.querySelector('textarea').value;

      if (!name || !email || !message) {
        alert("Please fill out all required fields.");
        return;
      }

      // Show success message
      successMessage.style.display = 'block';
      successMessage.style.opacity = 0;
      setTimeout(() => successMessage.style.opacity = 1, 100); // fade in

      // Optional: Auto-hide after 5 seconds
      setTimeout(() => {
        successMessage.style.opacity = 0;
        setTimeout(() => successMessage.style.display = 'none', 500); // wait for fade out
      }, 5000);

      form.reset();
    });
  });