const API = "http://localhost:5000/api";
let allProducts = [];

// Fetch and render all products on page load
fetchProducts();

// ✅ Fetch products from backend
function fetchProducts() {
  fetch(`${API}/products`)
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      renderProducts(data);
    })
    .catch(err => {
      console.error("❌ Failed to load products:", err);
      document.getElementById("product-list").innerHTML = "<p class='text-danger'>Failed to load products.</p>";
    });
}

// ✅ Render product cards
function renderProducts(products) {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p class='text-danger'>No products found.</p>";
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
  <div class="card h-100">
    <img src="${product.image}" class="card-img-top" alt="${product.name}">
    <div class="card-body">
      <h5 class="card-title">
        <a href="product.html?id=${product._id}" class="stretched-link text-decoration-none text-dark">
          ${product.name}
        </a>
      </h5>
      <p class="card-text">₹${product.price}</p>
      <p class="card-text"><small class="text-muted">${product.description}</small></p>
      <div class="d-flex gap-2">
        <button class="btn btn-primary btn-sm" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
        <button class="btn btn-outline-danger btn-sm" onclick='addToWishlist(${JSON.stringify(product)})'>❤️</button>
        <button class="btn btn-success btn-sm" onclick='buyNow(${JSON.stringify(product)})'>Buy Now</button>
      </div>
    </div>
  </div>
`;

    container.appendChild(card);
  });
}

// ✅ Search by name/category/description
function handleCategorySearch() {
  const query = document.getElementById("categorySearch").value.trim().toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    (p.category && p.category.toLowerCase().includes(query)) ||
    (p.description && p.description.toLowerCase().includes(query))
  );
  renderProducts(filtered);
}

// ✅ Add product to cart
function addToCart(product) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return window.location.href = "login.html";

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item._id === product._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
}

// ✅ Add product to wishlist
function addToWishlist(product) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return window.location.href = "login.html";

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const exists = wishlist.find(item => item._id === product._id);
  if (!exists) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(`${product.name} added to wishlist!`);
  } else {
    alert(`${product.name} is already in your wishlist.`);
  }
}

// ✅ Instant buy now
function buyNow(product) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return window.location.href = "login.html";

  const singleItemOrder = [{ ...product, quantity: 1 }];
  localStorage.setItem("instantOrder", JSON.stringify(singleItemOrder));
  window.location.href = "checkout.html";
}
