let cart = 0;

async function loadProducts(category = 'all') {
  const url = category === 'all' ? '/api/products' : `/api/products?category=${category}`;
  const res = await fetch(url);
  const products = await res.json();
  const grid = document.getElementById('products');
  grid.innerHTML = products.map(p => `
    <div class="card">
      <div class="emoji">${p.image}</div>
      <h3>${p.name}</h3>
      <div class="price">$${p.price}</div>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}

function addToCart(id) {
  cart++;
  document.getElementById('cart-count').textContent = `Cart: ${cart}`;
}

document.querySelectorAll('#filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadProducts(btn.dataset.cat);
  });
});

loadProducts();