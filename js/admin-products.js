// admin-products.js

function loadAdminProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tbody = document.getElementById('products-list');
    tbody.innerHTML = '';
    products.forEach(prod => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prod.id}</td>
            <td><img src="${prod.image}" alt="${prod.name}" width="50"></td>
            <td>${prod.name}</td>
            <td>${getCategoryName(prod.category)}</td>
            <td>${formatCurrency(prod.price)}</td>
            <td>${prod.stock}</td>
            <td>
                <button class="btn btn-sm btn-outline edit-product" data-id="${prod.id}">Sửa</button>
                <button class="btn btn-sm btn-danger delete-product" data-id="${prod.id}">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Gắn sự kiện
    document.querySelectorAll('.edit-product').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
}

document.getElementById('add-product-btn')?.addEventListener('click', () => {
    document.getElementById('product-form-container').style.display = 'block';
    document.getElementById('form-title').textContent = 'Thêm sản phẩm mới';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
});

document.getElementById('cancel-form')?.addEventListener('click', () => {
    document.getElementById('product-form-container').style.display = 'none';
});

document.getElementById('product-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('product-name').value.trim(),
        category: document.getElementById('product-category').value,
        price: parseInt(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        description: document.getElementById('product-description').value.trim(),
        colors: document.getElementById('product-colors').value.split(',').map(c => c.trim()).filter(c => c),
        image: document.getElementById('product-image').value.trim()
    };

    if (!productData.name || !productData.category || !productData.price || !productData.stock || !productData.image) {
        showToast('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }

    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (id) {
        // Sửa
        const index = products.findIndex(p => p.id == id);
        if (index >= 0) {
            products[index] = { ...products[index], ...productData };
            showToast('Cập nhật sản phẩm thành công', 'success');
        }
    } else {
        // Thêm
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, ...productData });
        showToast('Thêm sản phẩm thành công', 'success');
    }
    localStorage.setItem('products', JSON.stringify(products));
    document.getElementById('product-form-container').style.display = 'none';
    loadAdminProducts();
});

function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const prod = products.find(p => p.id == id);
    if (!prod) return;
    document.getElementById('product-id').value = prod.id;
    document.getElementById('product-name').value = prod.name;
    document.getElementById('product-category').value = prod.category;
    document.getElementById('product-price').value = prod.price;
    document.getElementById('product-stock').value = prod.stock;
    document.getElementById('product-description').value = prod.description;
    document.getElementById('product-colors').value = prod.colors ? prod.colors.join(', ') : '';
    document.getElementById('product-image').value = prod.image;
    document.getElementById('form-title').textContent = 'Sửa sản phẩm';
    document.getElementById('product-form-container').style.display = 'block';
}

function deleteProduct(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id != id);
    localStorage.setItem('products', JSON.stringify(products));
    loadAdminProducts();
    showToast('Đã xóa sản phẩm', 'success');
}