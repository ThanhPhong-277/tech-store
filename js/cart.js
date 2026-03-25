// cart.js

function addToCart(productId, quantity, color = null) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast('Sản phẩm không tồn tại', 'error');
        return;
    }
    if (product.stock < quantity) {
        showToast('Số lượng sản phẩm không đủ', 'error');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === productId && item.color === color);
    if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            color: color
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Đã thêm vào giỏ hàng', 'success');
}

function removeFromCart(productId, color = null) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.id === productId && item.color === color));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart(); // refresh
    showToast('Đã xóa sản phẩm', 'success');
}

function updateCartItem(productId, quantity, color = null) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId && item.color === color);
    if (!item) return;
    if (quantity <= 0) {
        removeFromCart(productId, color);
        return;
    }
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
        showToast('Số lượng vượt quá tồn kho', 'error');
        quantity = product.stock;
    }
    item.quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart();
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-container');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px 0;">
                <p class="empty-cart" style="font-size: 1.2rem; margin-bottom: 20px;">Giỏ hàng của bạn đang trống</p>
                <a href="products.html" class="btn btn-primary">
                    <i class="fa-solid fa-cart-arrow-down"></i> Tiếp tục mua sắm
                </a>
            </div>
        `;
        if (totalEl) totalEl.innerHTML = '';
        return;
    }

    // Render bảng giỏ hàng
    let html = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
    `;
    cart.forEach((item, index) => {
        html += `
            <tr data-id="${item.id}" data-color="${item.color || ''}">
                <td>
                    <div class="cart-product">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            ${item.color ? `<p>Màu: ${item.color}</p>` : ''}
                        </div>
                    </div>
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>
                    <input type="number" class="cart-quantity" value="${item.quantity}" min="1" data-index="${index}">
                </td>
                <td>${formatCurrency(item.price * item.quantity)}</td>
                <td><button class="btn btn-danger remove-item" data-index="${index}"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;
    });
    html += '</tbody></table>';

    // Form thông tin giao hàng
    html += `
        <div class="shipping-form">
            <h3>Thông tin giao hàng</h3>
            <div class="delivery-options">
                <label><input type="radio" name="delivery-type" value="shipping" checked> Giao tận nơi</label>
                <label><input type="radio" name="delivery-type" value="store"> Nhận tại cửa hàng</label>
            </div>
            <div id="shipping-fields" class="shipping-fields">
                <div class="form-group">
                    <label>Họ tên</label>
                    <input type="text" id="customer-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Số điện thoại</label>
                    <input type="tel" id="customer-phone" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="customer-email" class="form-control" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tỉnh/Thành phố</label>
                        <select id="province" class="form-control" required>
                            <option value="">Chọn tỉnh/thành</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Quận/Huyện</label>
                        <select id="district" class="form-control" required disabled>
                            <option value="">Chọn quận/huyện</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Phường/Xã</label>
                        <select id="ward" class="form-control" required disabled>
                            <option value="">Chọn phường/xã</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Địa chỉ chi tiết</label>
                    <input type="text" id="address-detail" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Ghi chú (tùy chọn)</label>
                    <textarea id="order-note" class="form-control"></textarea>
                </div>
                <div class="form-check">
                    <input type="checkbox" id="save-address"> <label for="save-address">Lưu địa chỉ cho lần sau</label>
                </div>
            </div>
            <div id="store-fields" class="store-fields" style="display:none;">
                <div class="form-group">
                    <label>Chọn cửa hàng</label>
                    <select id="store-select" class="form-control">
                        <option value="">Chọn cửa hàng</option>
                    </select>
                </div>
                <div id="store-detail" class="store-detail"></div>
            </div>
        </div>
        <div class="voucher-section">
            <h3>Mã giảm giá</h3>
            <div class="voucher-input">
                <select id="voucher-select" class="form-control">
                    <option value="">Chọn voucher</option>
                    
                </select>
                <button class="btn btn-outline" id="apply-voucher">Áp dụng</button>
            </div>
            <div id="applied-voucher" style="display:none;" class="applied-voucher">
                <span id="voucher-code"></span> <button class="btn-text" id="remove-voucher">Xóa</button>
                <span id="voucher-discount"></span>
            </div>
        </div>
    `;

    container.innerHTML = html;

    updateCartTotal();

    attachCartEvents();
    initLocationSelects();
    initStoreSelect();
    initVoucherSelect();
}

function attachCartEvents() {
    document.querySelectorAll('.cart-quantity').forEach(input => {
        input.addEventListener('change', function() {
            const index = this.dataset.index;
            const item = JSON.parse(localStorage.getItem('cart'))[index];
            let newQty = parseInt(this.value);

            // Xử lý khi người dùng nhập số âm hoặc số 0
            if (isNaN(newQty) || newQty <= 0) {
                // Nếu muốn cảnh báo và đặt lại về 1 (hoặc số lượng trước đó)
                showToast('Số lượng phải lớn hơn 0', 'error');
                this.value = item.quantity; // Khôi phục lại số lượng cũ trên giao diện
                return; 
                
                // HOẶC: Nếu bạn muốn khi nhập <= 0 sẽ tự động xóa sản phẩm, 
                // thì bỏ comment dòng dưới và comment 3 dòng trên.
                // updateCartItem(item.id, 0, item.color); 
                // return;
            }

            updateCartItem(item.id, newQty, item.color);
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            const item = JSON.parse(localStorage.getItem('cart'))[index];
            removeFromCart(item.id, item.color);
        });
    });

    // Delivery type toggle
    document.querySelectorAll('input[name="delivery-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const shippingFields = document.getElementById('shipping-fields');
            const storeFields = document.getElementById('store-fields');
            if (this.value === 'shipping') {
                shippingFields.style.display = 'block';
                storeFields.style.display = 'none';
            } else {
                shippingFields.style.display = 'none';
                storeFields.style.display = 'block';
                loadStoresForCart(); // load cửa hàng có sản phẩm
            }
            updateCartTotal();
        });
    });
}

function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value || 'shipping';
    let shipping = 0;
    if (deliveryType === 'shipping') {
        shipping = subtotal >= 5000000 ? 0 : 50000;
    }
    const discount = calculateDiscount(subtotal);
    const total = subtotal + shipping - discount;

    const totalEl = document.getElementById('cart-total');
    totalEl.innerHTML = `
        <div class="total-row"><span>Tạm tính:</span> <span>${formatCurrency(subtotal)}</span></div>
        <div class="total-row"><span>Phí vận chuyển:</span> <span>${shipping === 0 ? 'Miễn phí' : formatCurrency(shipping)}</span></div>
        ${discount > 0 ? `<div class="total-row discount"><span>Giảm giá:</span> <span>-${formatCurrency(discount)}</span></div>` : ''}
        <div class="total-row final"><span>Tổng cộng:</span> <span>${formatCurrency(total)}</span></div>
        <button class="btn btn-primary btn-block" id="checkout-btn">Thanh toán</button>
    `;

    document.getElementById('checkout-btn').addEventListener('click', checkout);
}

function calculateDiscount(subtotal) {
    const voucher = JSON.parse(localStorage.getItem('selectedVoucher'));
    if (!voucher) return 0;
    if (subtotal < voucher.minOrder) return 0;
    if (voucher.type === 'percent') {
        return subtotal * voucher.value / 100;
    } else {
        return voucher.value;
    }
}

function checkout() {
    if (!getCurrentUser()) {
        showToast('Vui lòng đăng nhập để thanh toán', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    // Validate thông tin
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    if (deliveryType === 'shipping') {
        const required = ['customer-name', 'customer-phone', 'customer-email', 'province', 'district', 'ward', 'address-detail'];
        for (let id of required) {
            const el = document.getElementById(id);
            if (!el || !el.value.trim()) {
                showToast('Vui lòng điền đầy đủ thông tin giao hàng', 'error');
                return;
            }
        }
    } else {
        const storeSelect = document.getElementById('store-select');
        if (!storeSelect || !storeSelect.value) {
            showToast('Vui lòng chọn cửa hàng', 'error');
            return;
        }
    }

    // Tạo đơn hàng
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = deliveryType === 'shipping' ? (subtotal >= 5000000 ? 0 : 50000) : 0;
    const discount = calculateDiscount(subtotal);
    const voucher = JSON.parse(localStorage.getItem('selectedVoucher'));

    const order = {
        id: Date.now(),
        userId: getCurrentUser().id,
        customerName: deliveryType === 'shipping' ? document.getElementById('customer-name').value : getCurrentUser().username,
        customerPhone: deliveryType === 'shipping' ? document.getElementById('customer-phone').value : '',
        customerEmail: deliveryType === 'shipping' ? document.getElementById('customer-email').value : getCurrentUser().email,
        deliveryType,
        storeId: deliveryType === 'store' ? document.getElementById('store-select').value : null,
        address: deliveryType === 'shipping' ? document.getElementById('address-detail').value : '',
        province: deliveryType === 'shipping' ? document.getElementById('province').value : '',
        district: deliveryType === 'shipping' ? document.getElementById('district').value : '',
        ward: deliveryType === 'shipping' ? document.getElementById('ward').value : '',
        note: document.getElementById('order-note')?.value || '',
        items: cart,
        subtotal,
        shipping,
        discount,
        voucherCode: voucher ? voucher.code : null,
        total: subtotal + shipping - discount,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Lưu đơn hàng
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Trừ tồn kho
    const products = JSON.parse(localStorage.getItem('products')) || [];
    cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (prod) prod.stock -= item.quantity;
    });
    localStorage.setItem('products', JSON.stringify(products));

    // Xóa giỏ hàng
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();

    // Xóa voucher đã dùng
    if (voucher) {
        const userVouchers = JSON.parse(localStorage.getItem('userVouchers')) || {};
        const userId = getCurrentUser().id;
        if (userVouchers[userId]) {
            userVouchers[userId] = userVouchers[userId].filter(v => v.id !== voucher.id);
            localStorage.setItem('userVouchers', JSON.stringify(userVouchers));
        }
        localStorage.removeItem('selectedVoucher');
    }

    showOrderSuccessPopup();
}

function showOrderSuccessPopup() {
    const overlay = document.getElementById('order-success-overlay');
    const modal = document.getElementById('order-success-modal');
    const homeBtn = document.getElementById('order-success-home');
    const ordersBtn = document.getElementById('order-success-orders');
    if (!overlay || !modal || !homeBtn || !ordersBtn) {
        showToast('Đặt hàng thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'my-orders.html';
        }, 1200);
        return;
    }

    overlay.style.display = 'block';
    modal.style.display = 'block';
    requestAnimationFrame(() => {
        overlay.classList.add('open');
        modal.classList.add('open');
    });

    const close = () => {
        overlay.classList.remove('open');
        modal.classList.remove('open');
        setTimeout(() => {
            overlay.style.display = 'none';
            modal.style.display = 'none';
        }, 200);
    };

    overlay.onclick = close;
    homeBtn.onclick = () => {
        close();
        window.location.href = 'index.html';
    };
    ordersBtn.onclick = () => {
        close();
        window.location.href = 'my-orders.html';
    };
}

function initVoucherSelect() {
    const select = document.getElementById('voucher-select');
    if (!select) return;
    loadUserVouchersToSelect();
    setupVoucherApply();
    syncSelectedVoucherUI();
}

function syncSelectedVoucherUI() {
    const selected = JSON.parse(localStorage.getItem('selectedVoucher') || 'null');
    const applied = document.getElementById('applied-voucher');
    const codeEl = document.getElementById('voucher-code');
    const discountEl = document.getElementById('voucher-discount');
    const select = document.getElementById('voucher-select');

    if (!applied || !codeEl || !discountEl || !select) return;

    if (!selected) {
        applied.style.display = 'none';
        return;
    }

    const available = typeof getAvailableVouchersForCart === 'function' ? getAvailableVouchersForCart() : [];
    const stillAvailable = available.some(v => v.id === selected.id);
    if (!stillAvailable) {
        localStorage.removeItem('selectedVoucher');
        applied.style.display = 'none';
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotal < (selected.minOrder || 0)) {
        localStorage.removeItem('selectedVoucher');
        applied.style.display = 'none';
        updateCartTotal();
        return;
    }

    select.value = String(selected.id);
    applied.style.display = 'block';
    codeEl.textContent = selected.code;
    const discount = selected.type === 'percent' ? subtotal * selected.value / 100 : selected.value;
    discountEl.textContent = `-${formatCurrency(discount)}`;
    updateCartTotal();
}

function initStoreSelect() {
    const select = document.getElementById('store-select');
    if (!select) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIds = cart.map(item => item.id);
    const stores = getStoresByProductIds(productIds);
    select.innerHTML = '<option value="">Chọn cửa hàng</option>';
    stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.id;
        option.textContent = store.name;
        select.appendChild(option);
    });
    select.addEventListener('change', function() {
        const storeId = this.value;
        const store = stores.find(s => s.id == storeId);
        const detailDiv = document.getElementById('store-detail');
        if (store) {
            detailDiv.innerHTML = `<p>Địa chỉ: ${store.address}<br>Điện thoại: ${store.phone}</p>`;
        } else {
            detailDiv.innerHTML = '';
        }
    });
}

// Khởi tạo select cửa hàng dựa trên sản phẩm trong giỏ
function initStoreSelect() {
    const storeSelect = document.getElementById('store-select');
    if (!storeSelect) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartProductIds = cart.map(item => item.id);
    const stores = JSON.parse(localStorage.getItem('stores')) || sampleStores; // cần có sampleStores từ data.js
    // Lọc cửa hàng có chứa ít nhất 1 sản phẩm trong giỏ
    const availableStores = stores.filter(store => 
        store.products.some(pid => cartProductIds.includes(pid))
    );
    storeSelect.innerHTML = '<option value="">Chọn cửa hàng</option>';
    availableStores.forEach(store => {
        const opt = document.createElement('option');
        opt.value = store.id;
        opt.textContent = store.name;
        storeSelect.appendChild(opt);
    });

    storeSelect.addEventListener('change', function() {
        const storeId = this.value;
        const detailDiv = document.getElementById('store-detail');
        if (storeId) {
            const store = stores.find(s => s.id == storeId);
            if (store) {
                detailDiv.innerHTML = `<p><i class="fas fa-map-marker-alt"></i> ${store.address}</p><p><i class="fas fa-phone"></i> ${store.phone}</p>`;
            }
        } else {
            detailDiv.innerHTML = '';
        }
    });
}
