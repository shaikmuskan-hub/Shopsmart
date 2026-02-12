const API = "http://localhost:5000/api";
let editingProductId = null;

function fetchProducts() {
  fetch(`${API}/products`)
    .then(res => res.json())
    .then(data => renderProducts(data))
    .catch(err => console.error("Failed to load products", err));
}

function renderProducts(products) {
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";

  products.forEach(product => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td><img src="${product.image}" height="50"/></td>
      <td>${product.category}</td>
      <td>${product.description}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick='editProduct(${JSON.stringify(product)})'>Edit</button>
        <button class="btn btn-sm btn-danger" onclick='deleteProduct("${product._id}")'>Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const unit = document.getElementById("productUnit").value || "piece";

  const newProduct = {
  name,
  price: parseFloat(price),
  image,
  description,
  category,
  unit: document.getElementById("productUnit").value || "piece"
};


  fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct)
  })
    .then(res => res.json())
    .then(() => {
      alert("Product added!");
      location.reload();
    })
    .catch(err => {
      console.error("Failed to add product:", err);
      alert("Error adding product.");
    });
}

function editProduct(product) {
  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("image").value = product.image;
  document.getElementById("category").value = product.category;
  document.getElementById("description").value = product.description;
  editingProductId = product._id;
}

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  fetch(`${API}/products/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    })
    .then(() => {
      alert("Product deleted!");
      fetchProducts();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to delete product.");
    });
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
  document.getElementById("category").value = "";
  document.getElementById("description").value = "";
  editingProductId = null;
}

fetchProducts();
