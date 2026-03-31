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
        openQuickView(product);
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

// Gắn sự kiện cho các nút lọc và xử lý URL
document.addEventListener('DOMContentLoaded', function () {
    // 1. Kiểm tra tham số trên URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    // 2. Nếu có tham số, cập nhật danh mục hiện tại
    if (categoryFromUrl) {
        currentCategory = categoryFromUrl;
    }

    // 3. Xử lý nút lọc danh mục
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        // Xóa trạng thái active của tất cả các nút
        btn.classList.remove('active');

        // Đặt trạng thái active cho nút khớp với danh mục hiện tại (từ URL hoặc mặc định)
        if (btn.dataset.category === currentCategory) {
            btn.classList.add('active');
        }

        // Sự kiện click chọn danh mục
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentCategory = this.dataset.category;

            // Xóa tham số trên URL khi người dùng tự bấm lọc tay cho đẹp
            window.history.pushState({}, '', 'products.html');

            applyFilters();
        });
    });

    // 4. Gọi applyFilters() ngay lập tức để lọc theo URL, BỎ gọi loadAllProducts()
    applyFilters();

    // Sự kiện cho nút lọc giá
    const priceBtns = document.querySelectorAll('.price-btn');
    if (priceBtns) {
        priceBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                priceBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                currentPriceMin = parseInt(this.dataset.min);
                currentPriceMax = parseInt(this.dataset.max);
                applyFilters();
            });
        });
    }

    // Sự kiện cho nút "Áp dụng" giá tự nhập
    const applyCustomPriceBtn = document.getElementById('apply-custom-price');
    if (applyCustomPriceBtn) {
        applyCustomPriceBtn.addEventListener('click', function () {
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

function openQuickView(product) {
    const modal = document.getElementById('quick-view-modal');
    const body = document.getElementById('quick-view-body');
    if (!modal || !body) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalInCart = cart.reduce((sum, item) => item.id === product.id ? sum + item.quantity : sum, 0);
    const isOutOfStock = product.stock <= 0;

    body.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; background: white; border-radius: 8px;">
            <div style="padding: 20px; border-right: 1px solid #eee;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto; object-fit: contain;">
            </div>
            <div style="padding: 30px; color: #333;">
                <span style="color: #666; font-size: 0.85rem; text-transform: uppercase;">${getCategoryName(product.category)}</span>
                <h2 style="font-size: 1.8rem; margin: 10px 0;">${product.name}</h2>
                <div style="font-size: 1.6rem; color: #e02424; font-weight: 900; margin-bottom: 15px;">${formatCurrency(product.price)}</div>
                
                <div style="color: #555; line-height: 1.6; margin-bottom: 20px; max-height: 150px; overflow-y: auto;">
                    ${product.description}
                </div>
                
                ${!isOutOfStock ? `
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <strong>Số lượng:</strong>
                    <div style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 6px;">
                        <button id="qv-minus" style="width: 35px; height: 35px; border: none; cursor: pointer;">-</button>
                        <input type="number" id="qv-qty" value="1" min="1" style="width: 50px; text-align: center; border: none;" readonly>
                        <button id="qv-plus" style="width: 35px; height: 35px; border: none; cursor: pointer;">+</button>
                    </div>
                </div>
                <button id="qv-buy-now" class="btn btn-primary" style="width: 100%; padding: 12px; margin-bottom: 10px; background: #ffcc00; color: black; border: none;">
                    Mua ngay
                </button>
                <button id="qv-add-cart" class="btn btn-outline" style="width: 100%; padding: 12px;">
                    Thêm vào giỏ hàng
                </button>
                ` : `<button class="btn btn-danger" disabled style="width: 100%;">Hết hàng</button>`}
            </div>
        </div>
    `;

    modal.style.display = 'flex';

    if (!isOutOfStock) {
        const qtyInput = document.getElementById('qv-qty');
        document.getElementById('qv-minus').onclick = () => { if (qtyInput.value > 1) qtyInput.value--; };
        document.getElementById('qv-plus').onclick = () => {
            if (parseInt(qtyInput.value) < product.stock - totalInCart) qtyInput.value++;
            else showToast("Vượt quá số lượng trong kho", "warning");
        };

        // Xử lý nút Mua ngay (Thêm và chuyển trang)
        document.getElementById('qv-buy-now').onclick = () => {
            const qty = parseInt(qtyInput.value);
            if (typeof addToCart === 'function') {
                addToCart(product.id, qty);
                window.location.href = 'cart.html'; // Chuyển tới giỏ hàng
            }
        };

        // Xử lý nút Thêm vào giỏ (Chỉ thêm, không chuyển trang)
        document.getElementById('qv-add-cart').onclick = () => {
            const qty = parseInt(qtyInput.value);
            if (typeof addToCart === 'function') {
                addToCart(product.id, qty);
                showToast("Đã thêm vào giỏ hàng", "success");
                modal.style.display = 'none'; // Đóng popup
            }
        };
    }
    document.getElementById('quick-view-close').onclick = () => modal.style.display = 'none';
}