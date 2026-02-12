const API = "http://localhost:5000/api";

// ✅ Add New Product
function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const image = document.getElementById("image").value.trim();
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!name || !price || !image || !category || !description) {
    return alert("Please fill all fields correctly.");
  }

  const product = { name, price, image, category, description };

  fetch(`${API}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  })
    .then(res => res.json())
    .then(() => {
      alert("✅ Product added!");
      document.querySelectorAll("input").forEach(i => i.value = "");
      loadProducts();
    })
    .catch(err => console.error("❌ Failed to add product:", err));
}

// ✅ Load Products
function loadProducts() {
  fetch(`${API}/products`)
    .then(res => res.json())
    .then(products => {
      const tbody = document.getElementById("productTableBody");
      tbody.innerHTML = "";

      products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="text" value="${product.name}" id="name-${product._id}" class="form-control" /></td>
          <td><input type="number" value="${product.price}" id="price-${product._id}" class="form-control" /></td>
          <td><img src="${product.image}" width="60" /></td>
          <td><input type="text" value="${product.category}" id="category-${product._id}" class="form-control" /></td>
          <td><input type="text" value="${product.description}" id="description-${product._id}" class="form-control" /></td>
          <td class="d-flex gap-2">
            <button class="btn btn-primary btn-sm" onclick="updateProduct('${product._id}')">Save</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("❌ Failed to load products:", err);
      document.getElementById("productTableBody").innerHTML = `<tr><td colspan="6" class="text-danger">Failed to load products.</td></tr>`;
    });
}

// ✅ Update Product
function updateProduct(id) {
  const name = document.getElementById(`name-${id}`).value.trim();
  const price = parseFloat(document.getElementById(`price-${id}`).value);
  const category = document.getElementById(`category-${id}`).value.trim();
  const description = document.getElementById(`description-${id}`).value.trim();

  if (!name || !price || !category || !description) {
    return alert("Please fill all fields correctly.");
  }

  fetch(`${API}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, category, description })
  })
    .then(res => res.json())
    .then(() => {
      alert("✅ Product updated");
      loadProducts();
    })
    .catch(err => console.error("❌ Failed to update product:", err));
}

// ✅ Delete Product
function deleteProduct(id) {
  if (!confirm("🗑️ Are you sure you want to delete this product?")) return;
  fetch(`${API}/products/${id}`, { method: "DELETE" })
    .then(() => {
      alert("🗑️ Product deleted");
      loadProducts();
    })
    .catch(err => console.error("❌ Failed to delete product:", err));
}

// 🔁 Load all products when admin page opens
loadProducts();
