// Lấy danh sách voucher từ localStorage
function getVouchers() {
    return JSON.parse(localStorage.getItem('vouchers')) || [];
}

function isVoucherActive(v) {
    if (!v || v.active === false) return false;
    if (!v.expiry) return true;
    const expiry = new Date(v.expiry);
    if (Number.isNaN(expiry.getTime())) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(23, 59, 59, 999);
    return expiry >= today;
}

function getAvailableVouchersForCart() {
    const active = getVouchers().filter(isVoucherActive);
    const user = getCurrentUser();
    if (!user) return active;
    const owned = getUserVouchers();
    const byId = new Map();
    active.forEach(v => byId.set(v.id, v));
    owned.forEach(v => byId.set(v.id, v));
    return Array.from(byId.values());
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
    select.innerHTML = '<option value="">Chọn voucher</option>';
    const vouchers = getAvailableVouchersForCart();
    if (!vouchers.length) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Hiện chưa có voucher';
        select.appendChild(opt);
        return;
    }
    vouchers.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.id;
        const valueText = v.type === 'percent' ? v.value + '%' : formatCurrency(v.value);
        const minText = v.minOrder ? `Tối thiểu ${formatCurrency(v.minOrder)}` : 'Không giới hạn đơn tối thiểu';
        opt.textContent = `${v.code} - ${valueText} (${minText})`;
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
        const vouchers = getAvailableVouchersForCart();
        const voucher = vouchers.find(v => v.id === voucherId);
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
