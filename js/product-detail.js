// product-detail.js

function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    if (!id) {
        document.getElementById('product-detail').innerHTML = '<p class="error">Không tìm thấy sản phẩm.</p>';
        return;
    }
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    if (!product) {
        document.getElementById('product-detail').innerHTML = '<p class="error">Sản phẩm không tồn tại.</p>';
        return;
    }

    // Cập nhật breadcrumb
    document.getElementById('product-category').textContent = getCategoryName(product.category);
    document.getElementById('product-name').textContent = product.name;

    // Tạo HTML chi tiết
    let colorsHtml = '';
    if (product.colors && product.colors.length > 0) {
        colorsHtml = `
            <div class="product-colors">
                <h3>Màu sắc:</h3>
                <div class="color-options">
                    ${product.colors.map((c, idx) => `
                        <span class="color-option ${idx === 0 ? 'selected' : ''}" data-color="${c}" style="background-color: ${colorNameToHex(c)}">${c}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    const html = `
        <div class="product-detail-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
            <h2>${product.name}</h2>
            <p class="price">${formatCurrency(product.price)}</p>
            <p class="stock ${product.stock > 0 ? (product.stock < 5 ? 'low-stock' : 'in-stock') : 'out-of-stock'}">
                <i class="fas fa-${product.stock > 0 ? 'check' : 'times'}"></i>
                ${product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </p>
            <div class="description">
                <h3>Mô tả sản phẩm:</h3>
                <p>${product.description}</p>
            </div>
            ${colorsHtml}
            <div class="quantity-selector">
                <label for="quantity">Số lượng:</label>
                <input type="number" id="quantity" value="1" min="1" max="${product.stock}" class="form-control quantity-input">
            </div>
            <div class="detail-actions">
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Thêm vào giỏ</button>
                <button class="btn btn-outline buy-now" data-id="${product.id}">Mua ngay</button>
            </div>
        </div>
    `;
    document.getElementById('product-detail').innerHTML = html;

    // Xử lý sự kiện
    document.querySelector('.add-to-cart').addEventListener('click', function() {
        let qty = parseInt(document.getElementById('quantity').value);
        
        // Kiểm tra nếu số lượng <= 0 hoặc không phải là số hợp lệ
        if (isNaN(qty) || qty <= 0) {
            showToast('Vui lòng nhập số lượng hợp lệ (lớn hơn 0)', 'error');
            document.getElementById('quantity').value = 1; // Đặt lại về 1
            return;
        }

        const selectedColor = document.querySelector('.color-option.selected')?.dataset.color || null;
        addToCart(product.id, qty, selectedColor);
    });

    document.querySelector('.buy-now').addEventListener('click', function() {
        let qty = parseInt(document.getElementById('quantity').value);
        
        // Kiểm tra nếu số lượng <= 0 hoặc không phải là số hợp lệ
        if (isNaN(qty) || qty <= 0) {
            showToast('Vui lòng nhập số lượng hợp lệ (lớn hơn 0)', 'error');
            document.getElementById('quantity').value = 1; // Đặt lại về 1
            return;
        }

        const selectedColor = document.querySelector('.color-option.selected')?.dataset.color || null;
        addToCart(product.id, qty, selectedColor);
        
        // Chỉ chuyển trang nếu hàm addToCart chạy thành công
        // (Bạn có thể kiểm tra thêm logic này nếu cần, nhưng cơ bản như vậy là ổn)
        setTimeout(() => {
             window.location.href = 'cart.html';
        }, 500); // Đợi 1 chút để toast message hiện lên (tùy chọn)
    });

    // Xử lý chọn màu
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function colorNameToHex(name) {
    const map = { 'Đen': '#000000', 'Trắng': '#FFFFFF', 'Xám': '#808080', 'Đỏ': '#FF0000', 'Xanh': '#0000FF', 'Vàng': '#FFFF00' };
    return map[name] || '#CCCCCC';
}