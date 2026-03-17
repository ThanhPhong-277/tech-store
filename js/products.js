// products.js

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <span class="product-category">${getCategoryName(product.category)}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <div class="product-stock ${product.stock > 0 ? (product.stock < 5 ? 'low-stock' : 'in-stock') : 'out-of-stock'}">
                <i class="fas fa-${product.stock > 0 ? 'check' : 'times'}"></i>
                ${product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </div>
            <div class="product-actions">
                <button class="btn btn-outline view-detail" data-id="${product.id}">Chi tiết</button>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>Thêm vào giỏ</button>
            </div>
        </div>
    `;
    div.querySelector('.view-detail').addEventListener('click', () => {
        window.location.href = `product-detail.html?id=${product.id}`;
    });
    div.querySelector('.add-to-cart').addEventListener('click', () => {
        // Gọi hàm addToCart từ cart.js (phải có cart.js load trước)
        if (typeof addToCart === 'function') {
            addToCart(product.id, 1);
        } else {
            console.error('addToCart not defined');
        }
    });
    return div;
}

function loadAllProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const grid = document.getElementById('product-grid');
    const noProducts = document.getElementById('no-products');
    
    if (!grid) {
        console.error('Không tìm thấy #product-grid');
        return;
    }
    
    if (products.length === 0) {
        grid.innerHTML = '';
        if (noProducts) noProducts.style.display = 'block';
        return;
    }
    
    grid.innerHTML = '';
    if (noProducts) noProducts.style.display = 'none';
    
    products.forEach(prod => {
        const card = createProductCard(prod);
        grid.appendChild(card);
    });
}

function renderProducts(productsArray) {
    const grid = document.getElementById('product-grid');
    const noProducts = document.getElementById('no-products');
    if (!grid) return;
    grid.innerHTML = '';
    if (productsArray.length === 0) {
        if (noProducts) noProducts.style.display = 'block';
        return;
    }
    if (noProducts) noProducts.style.display = 'none';
    productsArray.forEach(prod => {
        const card = createProductCard(prod);
        grid.appendChild(card);
    });
}

function filterProducts(category) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    renderProducts(filtered);
}

// Gắn sự kiện cho các nút lọc
document.addEventListener('DOMContentLoaded', function() {
    loadAllProducts(); // Tải tất cả sản phẩm khi trang load
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const cat = this.dataset.category;
            filterProducts(cat);
        });
    });
});