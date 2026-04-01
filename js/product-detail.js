// product-detail.js

function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    
    if (!id) {
        document.getElementById('product-detail').innerHTML = '<p class="error" style="padding: 20px;">Không tìm thấy mã sản phẩm.</p>';
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    
    if (!product) {
        document.getElementById('product-detail').innerHTML = '<p class="error" style="padding: 20px;">Sản phẩm không tồn tại.</p>';
        return;
    }

    document.getElementById('product-category').textContent = getCategoryName(product.category);
    document.getElementById('product-name').textContent = product.name;

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

    // 2. Tạo HTML toàn bộ trang
    const productHtml = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; background: white; border-radius: 8px; gap: 30px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
        <div style="padding: 20px; border-right: 1px solid #eee; display: flex; justify-content: center; align-items: center;">
            <img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: auto; object-fit: contain; max-height: 400px;">
        </div>
        
        <div style="padding: 10px 20px; color: #333;">
            <span style="color: #666; font-size: 0.85rem; text-transform: uppercase;">${getCategoryName(product.category)}</span>
            <h2 style="font-size: 1.8rem; margin: 10px 0;">${product.name}</h2>
            
            <div id="pd-price-display" style="font-size: 1.8rem; color: #e02424; font-weight: 900; margin-bottom: 15px;">
                ${formatCurrency(product.price)}
                ${initialExtraPrice > 0 ? `<span style="font-size: 1.2rem; color: #ff9900;"> + ${formatCurrency(initialExtraPrice)}</span>` : ''}
            </div>
            
            <div style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                ${product.description}
            </div>
            
            ${colorsHtml}
            
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                <strong>Số lượng:</strong>
                <div style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 6px;">
                    <button id="btn-minus" style="width: 35px; height: 35px; border: none; cursor: pointer; background: #f9f9f9;">-</button>
                    <input type="number" id="quantity" value="1" min="1" max="${product.stock}" style="width: 50px; text-align: center; border: none; font-size: 1rem;" readonly>
                    <button id="btn-plus" style="width: 35px; height: 35px; border: none; cursor: pointer; background: #f9f9f9;">+</button>
                </div>
                <span style="color: #777; font-size: 0.9rem;">(Còn ${product.stock} sản phẩm)</span>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button class="buy-now btn btn-primary" style="flex: 1; padding: 14px; background: #ffcc00; color: black; border: none; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 1rem;">
                    Mua ngay
                </button>
                <button class="add-to-cart btn btn-outline" style="flex: 1; padding: 14px; font-weight: bold; cursor: pointer; border: 1px solid #e02424; color: #e02424; background: white; border-radius: 4px; font-size: 1rem;">
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    </div>
    `;

    document.getElementById('product-detail').innerHTML = productHtml;

    document.getElementById('btn-minus').addEventListener('click', function() {
        let input = document.getElementById('quantity');
        if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
    });
    
    document.getElementById('btn-plus').addEventListener('click', function() {
        let input = document.getElementById('quantity');
        if (parseInt(input.value) < product.stock) input.value = parseInt(input.value) + 1;
    });

    // 3. Xử lý click đổi màu sắc -> Cập nhật lại giá
    document.querySelectorAll('#product-detail .color-option').forEach(opt => {
        opt.addEventListener('click', function () {
            document.querySelectorAll('#product-detail .color-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');

            // Tính và in lại giá
            const extra = parseInt(this.dataset.extra) || 0;
            const priceDisplay = document.getElementById('pd-price-display');
            if (extra > 0) {
                priceDisplay.innerHTML = `${formatCurrency(product.price)} <span style="font-size: 1.2rem; color: #ff9900;"> + ${formatCurrency(extra)}</span>`;
            } else {
                priceDisplay.innerHTML = `${formatCurrency(product.price)}`;
            }
        });
    });

    document.querySelector('.add-to-cart').addEventListener('click', function () {
        let qty = parseInt(document.getElementById('quantity').value);
        if (isNaN(qty) || qty <= 0) return;
        const selectedColor = document.querySelector('.color-option.selected')?.dataset.color || null;
        if (typeof addToCart === 'function') addToCart(product.id, qty, selectedColor);
    });

    document.querySelector('.buy-now').addEventListener('click', function () {
        let qty = parseInt(document.getElementById('quantity').value);
        if (isNaN(qty) || qty <= 0) return;
        const selectedColor = document.querySelector('.color-option.selected')?.dataset.color || null;
        if (typeof addToCart === 'function') {
            addToCart(product.id, qty, selectedColor);
            setTimeout(() => { window.location.href = 'cart.html'; }, 500); 
        }
    });
}

function colorNameToHex(name) {
    const map = { 'Đen': '#000000', 'Trắng': '#FFFFFF', 'Xám': '#808080', 'Đỏ': '#FF0000', 'Xanh': '#0000FF', 'Vàng': '#FFFF00' };
    return map[name] || '#CCCCCC';
}

// Hàm quy định giá cộng thêm cho các màu đặc biệt
function getColorExtraPrice(colorName) {
    if (!colorName) return 0;
    const extraPrices = {
        'Trắng': 500000,
        'White': 500000,
        'Platinum White': 500000,
        'Moonlight White': 500000,
        'Red': 1000000, // Ví dụ bản màu đỏ giới hạn đắt hơn 1 triệu
        'Volt Green': 500000,
        'Electro Punk': 500000
    };
    return extraPrices[colorName] || 0; // Các màu khác mặc định không cộng thêm tiền
}