// utils.js

// Hiển thị thông báo toast
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <span class="toast-close">&times;</span>
    `;
    document.body.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => toast.remove());

    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, duration);
}

// Định dạng tiền VNĐ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Lấy tên danh mục từ category key
function getCategoryName(category) {
    const map = {
        'laptop': 'Laptop',
        'monitor': 'Màn hình',
        'keyboard': 'Bàn phím',
        'mouse': 'Chuột'
    };
    return map[category] || category;
}

// Kiểm tra đăng nhập
function isLoggedIn() {
    return currentUser !== null;
}

// Kiểm tra admin
function isAdmin() {
    return currentUser && currentUser.isAdmin === true;
}

// Cập nhật số lượng giỏ hàng trên header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = total;
}

// Hiển thị popup chúc mừng năm mới (chỉ hiện 1 lần mỗi phiên)
function showNewYearPopup() {
    if (!sessionStorage.getItem('newyear_shown')) {
        const popup = document.getElementById('newyear-popup');
        if (popup) {
            popup.style.display = 'flex';
            const closeBtn = popup.querySelector('.close-popup');
            closeBtn.addEventListener('click', () => {
                popup.style.display = 'none';
                sessionStorage.setItem('newyear_shown', 'true');
            });
            // Tự động đóng sau 5 giây
            setTimeout(() => {
                popup.style.display = 'none';
                sessionStorage.setItem('newyear_shown', 'true');
            }, 5000);
        }
    }
}

// Xuất các hàm ra global
window.showToast = showToast;
window.formatCurrency = formatCurrency;
window.getCategoryName = getCategoryName;
window.isLoggedIn = isLoggedIn;
window.isAdmin = isAdmin;
window.updateCartCount = updateCartCount;
window.showNewYearPopup = showNewYearPopup;

// Thêm vào cuối file utils.js

// Format số
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Lấy ngày hiện tại dạng YYYY-MM-DD
function getCurrentDate() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Lấy ngày đầu tháng
function getFirstDayOfMonth() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

// Lấy ngày cuối tháng
function getLastDayOfMonth() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()}`;
}

// Kiểm tra chuỗi rỗng
function isEmpty(str) {
    return !str || str.trim() === '';
}

// Tạo ID ngẫu nhiên
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Copy object
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Xuất các hàm ra global
window.formatNumber = formatNumber;
window.getCurrentDate = getCurrentDate;
window.getFirstDayOfMonth = getFirstDayOfMonth;
window.getLastDayOfMonth = getLastDayOfMonth;
window.isEmpty = isEmpty;
window.generateId = generateId;
window.deepCopy = deepCopy;
window.debounce = debounce;