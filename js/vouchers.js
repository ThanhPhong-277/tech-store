// vouchers.js

// Lấy danh sách voucher từ localStorage
function getVouchers() {
    return JSON.parse(localStorage.getItem('vouchers')) || [];
}

// Lấy voucher của người dùng hiện tại
function getUserVouchers() {
    const user = getCurrentUser();
    if (!user) return [];
    const all = JSON.parse(localStorage.getItem('userVouchers')) || {};
    return all[user.id] || [];
}

// Thêm voucher cho người dùng (khi họ lấy voucher từ trang admin)
function addUserVoucher(voucher) {
    const user = getCurrentUser();
    if (!user) return false;
    const all = JSON.parse(localStorage.getItem('userVouchers')) || {};
    if (!all[user.id]) all[user.id] = [];
    // Kiểm tra trùng
    if (all[user.id].some(v => v.id === voucher.id)) return false;
    all[user.id].push(voucher);
    localStorage.setItem('userVouchers', JSON.stringify(all));
    return true;
}

// Xóa voucher của user (khi dùng rồi)
function removeUserVoucher(voucherId) {
    const user = getCurrentUser();
    if (!user) return;
    const all = JSON.parse(localStorage.getItem('userVouchers')) || {};
    if (all[user.id]) {
        all[user.id] = all[user.id].filter(v => v.id !== voucherId);
        localStorage.setItem('userVouchers', JSON.stringify(all));
    }
}

// Áp dụng voucher (lưu tạm vào session để dùng trong giỏ hàng)
function selectVoucher(voucher) {
    localStorage.setItem('selectedVoucher', JSON.stringify(voucher));
}

function clearSelectedVoucher() {
    localStorage.removeItem('selectedVoucher');
}

// Hiển thị voucher trong dropdown giỏ hàng
function loadUserVouchersToSelect() {
    const select = document.getElementById('voucher-select');
    if (!select) return;
    const userVouchers = getUserVouchers();
    select.innerHTML = '<option value="">Chọn voucher</option>';
    userVouchers.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.id;
        opt.textContent = `${v.code} - ${v.type === 'percent' ? v.value + '%' : formatCurrency(v.value)} (tối thiểu ${formatCurrency(v.minOrder)})`;
        select.appendChild(opt);
    });
}

// Xử lý nút áp dụng voucher trong giỏ hàng
function setupVoucherApply() {
    const applyBtn = document.getElementById('apply-voucher');
    if (!applyBtn) return;
    applyBtn.addEventListener('click', function() {
        const select = document.getElementById('voucher-select');
        const voucherId = parseInt(select.value);
        if (!voucherId) {
            showToast('Chọn voucher', 'error');
            return;
        }
        const userVouchers = getUserVouchers();
        const voucher = userVouchers.find(v => v.id === voucherId);
        if (!voucher) return;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (subtotal < voucher.minOrder) {
            showToast(`Đơn hàng tối thiểu ${formatCurrency(voucher.minOrder)}`, 'error');
            return;
        }
        selectVoucher(voucher);
        document.getElementById('applied-voucher').style.display = 'block';
        document.getElementById('voucher-code').textContent = voucher.code;
        let discount = voucher.type === 'percent' ? subtotal * voucher.value / 100 : voucher.value;
        document.getElementById('voucher-discount').textContent = `-${formatCurrency(discount)}`;
        updateCartTotal();
    });

    const removeBtn = document.getElementById('remove-voucher');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            clearSelectedVoucher();
            document.getElementById('applied-voucher').style.display = 'none';
            updateCartTotal();
        });
    }
}