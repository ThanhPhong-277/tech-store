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

    // 1. Tạo HTML phần màu sắc (có đính kèm data-extra)
    let colorsHtml = '';
    let initialExtraPrice = 0;
    if (product.colors && product.colors.length > 0) {
        initialExtraPrice = getColorExtraPrice(product.colors[0]); // Lấy giá cộng thêm của màu đầu tiên
        colorsHtml = `
        <div style="margin-bottom: 20px;">
            <strong style="display: block; margin-bottom: 10px;">Màu sắc:</strong>
            <div class="color-options" style="display: flex; gap: 10px; flex-wrap: wrap;">
                ${product.colors.map((c, idx) => {
                    const extra = getColorExtraPrice(c);
                    return `
                    <span class="color-option ${idx === 0 ? 'selected' : ''}" data-color="${c}" data-extra="${extra}" style="background-color: ${colorNameToHex(c)}; display: inline-flex; align-items: center; padding: 6px 12px; border-radius: 4px; cursor: pointer; border: 1px solid #ccc; color: #fff; text-shadow: 0px 0px 3px rgba(0,0,0,0.8); transition: all 0.2s;">
                        ${c} <i class="fas fa-check tick-icon"></i>
                    </span>`;
                }).join('')}
            </div>
        </div>
        `;
    }

    body.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; background: white; border-radius: 8px;">
            <div style="padding: 20px; border-right: 1px solid #eee;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto; object-fit: contain;">
            </div>
            <div style="padding: 30px; color: #333;">
                <span style="color: #666; font-size: 0.85rem; text-transform: uppercase;">${getCategoryName(product.category)}</span>
                <h2 style="font-size: 1.8rem; margin: 10px 0;">${product.name}</h2>
                
                <div id="qv-price-display" style="font-size: 1.6rem; color: #e02424; font-weight: 900; margin-bottom: 15px;">
                    ${formatCurrency(product.price)}
                    ${initialExtraPrice > 0 ? `<span style="font-size: 1.2rem; color: #ff9900;"> + ${formatCurrency(initialExtraPrice)}</span>` : ''}
                </div>
                
                <div style="color: #555; line-height: 1.6; margin-bottom: 20px; max-height: 150px; overflow-y: auto;">
                    ${product.description}
                </div>
                
                ${!isOutOfStock ? `
                ${colorsHtml}
                
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
        // 3. Xử lý click đổi màu sắc -> Cập nhật lại giá
        document.querySelectorAll('#quick-view-body .color-option').forEach(opt => {
            opt.addEventListener('click', function () {
                document.querySelectorAll('#quick-view-body .color-option').forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');

                // Tính và in lại giá
                const extra = parseInt(this.dataset.extra) || 0;
                const priceDisplay = document.getElementById('qv-price-display');
                if (extra > 0) {
                    priceDisplay.innerHTML = `${formatCurrency(product.price)} <span style="font-size: 1.2rem; color: #ff9900;"> + ${formatCurrency(extra)}</span>`;
                } else {
                    priceDisplay.innerHTML = `${formatCurrency(product.price)}`;
                }
            });
        });

        const qtyInput = document.getElementById('qv-qty');
        document.getElementById('qv-minus').onclick = () => { if (qtyInput.value > 1) qtyInput.value--; };
        document.getElementById('qv-plus').onclick = () => {
            if (parseInt(qtyInput.value) < product.stock - totalInCart) qtyInput.value++;
            else if (typeof showToast === 'function') showToast("Vượt quá số lượng trong kho", "warning");
        };

        const getSelectedColor = () => {
            const selectedOpt = document.querySelector('#quick-view-body .color-option.selected');
            return selectedOpt ? selectedOpt.dataset.color : null;
        };

        document.getElementById('qv-buy-now').onclick = () => {
            const qty = parseInt(qtyInput.value);
            const color = getSelectedColor();
            if (typeof addToCart === 'function') {
                addToCart(product.id, qty, color);
                setTimeout(() => { window.location.href = 'cart.html'; }, 500);
            }
        };

        document.getElementById('qv-add-cart').onclick = () => {
            const qty = parseInt(qtyInput.value);
            const color = getSelectedColor();
            if (typeof addToCart === 'function') {
                addToCart(product.id, qty, color);
                if (typeof showToast === 'function') showToast("Đã thêm vào giỏ hàng", "success");
                modal.style.display = 'none'; 
            }
        };
    }
    
    const closeBtn = document.getElementById('quick-view-close') || document.querySelector('.close-modal');
    if(closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
}

function colorNameToHex(name) {
    const map = { 
        'Đen': '#000000', 'Black': '#000000', 'Off Black': '#1a1a1a', 'Original Black': '#000000', 'Eclipse Gray': '#4a4a4a', 
        'Trắng': '#FFFFFF', 'White': '#FFFFFF', 'Platinum White': '#f5f5f5', 'Moonlight White': '#f0f0f0',
        'Xám': '#808080', 'Silver': '#c0c0c0', 'Armor Titanium': '#878681', 'Grey': '#808080',
        'Đỏ': '#FF0000', 'Red': '#FF0000', 
        'Xanh': '#0000FF', 
        'Vàng': '#FFFF00', 'Volt Green': '#caff00',
        'Electro Punk': '#ff007f'
    };
    return map[name] || '#CCCCCC';
}

// Hàm lấy giá cộng thêm từ LocalStorage (Có thể quản lý trong Admin)
function getColorExtraPrice(colorName) {
    if (!colorName) return 0;
    
    // Lấy danh sách giá màu từ bộ nhớ, nếu chưa có thì tạo danh sách mặc định
    let colorPrices = JSON.parse(localStorage.getItem('colorPrices'));
    if (!colorPrices) {
        colorPrices = {
            'Trắng': 500000, 'White': 500000, 'Platinum White': 500000, 'Moonlight White': 500000,
            'Red': 1000000, 'Volt Green': 500000, 'Electro Punk': 500000
        };
        localStorage.setItem('colorPrices', JSON.stringify(colorPrices));
    }
    
    return parseInt(colorPrices[colorName]) || 0; 
}