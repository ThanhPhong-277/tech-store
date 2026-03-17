// script.js

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật số lượng giỏ hàng
    updateCartCount();

    // Nếu có popup năm mới trên trang, xử lý
    const newYearPopup = document.getElementById('newyear-popup');
    if (newYearPopup && !sessionStorage.getItem('newyear_shown')) {
        newYearPopup.style.display = 'flex';
        const closeBtn = newYearPopup.querySelector('.close-popup');
        closeBtn.addEventListener('click', () => {
            newYearPopup.style.display = 'none';
            sessionStorage.setItem('newyear_shown', 'true');
        });
        setTimeout(() => {
            newYearPopup.style.display = 'none';
            sessionStorage.setItem('newyear_shown', 'true');
        }, 5000);
    }
});

// Hàm tải sản phẩm nổi bật (dùng cho index)
function loadFeaturedProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const featured = products.slice(0, 4); // lấy 4 sản phẩm đầu
    const grid = document.getElementById('featured-products');
    if (!grid) return;
    grid.innerHTML = '';
    featured.forEach(prod => {
        const card = createProductCard(prod);
        grid.appendChild(card);
    });
}

// Tạo card sản phẩm (dùng chung)
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
    // Thêm sự kiện
    div.querySelector('.view-detail').addEventListener('click', () => {
        window.location.href = `product-detail.html?id=${product.id}`;
    });
    div.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(product.id, 1);
    });
    return div;
}