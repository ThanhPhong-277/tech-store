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
        if (typeof addToCart === 'function') {
            // Lấy giỏ hàng hiện tại
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Tính tổng số lượng sản phẩm này đã có trong giỏ hàng
            let totalInCart = cart.reduce((sum, item) => item.id === product.id ? sum + item.quantity : sum, 0);

            // Kiểm tra tổng số lượng sau khi thêm có vượt quá tồn kho không
            if (totalInCart + 1 > product.stock) {
                if (typeof showToast === 'function') {
                    showToast(`Kho chỉ còn ${product.stock} cái. Bạn đã có ${totalInCart} cái trong giỏ!`, 'error');
                } else {
                    alert(`Kho chỉ còn ${product.stock} cái. Bạn đã có ${totalInCart} cái trong giỏ!`);
                }
                return; // Ngừng thực thi, không cho thêm vào giỏ
            }

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

// function filterProducts(category) {
//     const products = JSON.parse(localStorage.getItem('products')) || [];
//     const filtered = category === 'all' ? products : products.filter(p => p.category === category);
//     renderProducts(filtered);
// }

// // Gắn sự kiện cho các nút lọc
// document.addEventListener('DOMContentLoaded', function() {
//     loadAllProducts(); // Tải tất cả sản phẩm khi trang load
    
//     const filterBtns = document.querySelectorAll('.filter-btn');
//     filterBtns.forEach(btn => {
//         btn.addEventListener('click', function() {
//             filterBtns.forEach(b => b.classList.remove('active'));
//             this.classList.add('active');
//             const cat = this.dataset.category;
//             filterProducts(cat);
//         });
//     });
// });

// Biến toàn cục để lưu trạng thái lọc hiện tại
let currentCategory = 'all';
let currentPriceMin = 0;
let currentPriceMax = 999999999;

function applyFilters() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    const filtered = products.filter(p => {
        // Kiểm tra danh mục
        const matchCategory = (currentCategory === 'all' || p.category === currentCategory);
        
        // Kiểm tra giá
        const matchPrice = (p.price >= currentPriceMin && p.price <= currentPriceMax);
        
        return matchCategory && matchPrice;
    });

    renderProducts(filtered);
}

// Gắn sự kiện cho các nút lọc
document.addEventListener('DOMContentLoaded', function() {
    loadAllProducts(); // Tải tất cả sản phẩm khi trang load
    
    // Sự kiện cho nút lọc danh mục
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.dataset.category;
            applyFilters();
        });
    });

    // Sự kiện cho nút lọc giá
    const priceBtns = document.querySelectorAll('.price-btn');
    if (priceBtns) {
        priceBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                priceBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                currentPriceMin = parseInt(this.dataset.min);
                currentPriceMax = parseInt(this.dataset.max);
                applyFilters();
            });
        });
    }

    // THÊM MỚI: Sự kiện cho nút "Áp dụng" giá tự nhập
    const applyCustomPriceBtn = document.getElementById('apply-custom-price');
    if (applyCustomPriceBtn) {
        applyCustomPriceBtn.addEventListener('click', function() {
            const minInput = document.getElementById('min-price').value;
            const maxInput = document.getElementById('max-price').value;

            // Bỏ chọn (xóa active) các nút giá mặc định vì người dùng đang dùng giá tự nhập
            const priceBtns = document.querySelectorAll('.price-btn');
            priceBtns.forEach(b => b.classList.remove('active'));

            // Gán giá trị, nếu để trống thì lấy mặc định là 0 hoặc vô hạn
            currentPriceMin = minInput !== '' ? parseInt(minInput) : 0;
            currentPriceMax = maxInput !== '' ? parseInt(maxInput) : 999999999;

            // Đảo lại nếu người dùng nhập Giá từ > Giá đến
            if (minInput !== '' && maxInput !== '' && currentPriceMin > currentPriceMax) {
                let temp = currentPriceMin;
                currentPriceMin = currentPriceMax;
                currentPriceMax = temp;
                
                // Hiển thị lại đúng số trên ô input
                document.getElementById('min-price').value = currentPriceMin;
                document.getElementById('max-price').value = currentPriceMax;
            }

            // Gọi hàm lọc lại sản phẩm
            applyFilters();
        });
    }
});