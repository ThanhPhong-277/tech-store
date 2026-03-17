// auth.js

let currentUser = null;

// Kiểm tra trạng thái đăng nhập từ localStorage
function loadCurrentUser() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
        currentUser = JSON.parse(stored);
    } else {
        currentUser = null;
    }
    updateUIForUser();
}

// Cập nhật giao diện theo quyền user
function updateUIForUser() {
    const userInfo = document.getElementById('user-info');
    const guestButtons = document.getElementById('guest-buttons');
    const usernameDisplay = document.getElementById('username-display');
    const userOnlyItems = document.querySelectorAll('.user-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');

    if (currentUser) {
        // Đã đăng nhập
        if (userInfo) userInfo.style.display = 'flex';
        if (guestButtons) guestButtons.style.display = 'none';
        if (usernameDisplay) usernameDisplay.textContent = currentUser.username;

        // Hiển thị menu cho user thường
        userOnlyItems.forEach(el => el.style.display = 'list-item');

        // Hiển thị menu admin nếu là admin
        if (currentUser.isAdmin) {
            adminOnlyItems.forEach(el => el.style.display = 'list-item');
        } else {
            adminOnlyItems.forEach(el => el.style.display = 'none');
        }
    } else {
        // Chưa đăng nhập
        if (userInfo) userInfo.style.display = 'none';
        if (guestButtons) guestButtons.style.display = 'flex';
        userOnlyItems.forEach(el => el.style.display = 'none');
        adminOnlyItems.forEach(el => el.style.display = 'none');
    }
}

// Đăng nhập
function login(usernameOrEmail, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Tìm user theo username hoặc email và password
    const user = users.find(u => 
        (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
        u.password === password
    );
    if (user) {
        // Không lưu password vào currentUser
        const { password, ...safeUser } = user;
        currentUser = safeUser;
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        updateUIForUser();
        return { success: true, user: safeUser };
    }
    return { success: false, message: 'Sai tên đăng nhập/email hoặc mật khẩu' };
}

// Đăng ký
function register(username, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Kiểm tra username và email đã tồn tại chưa
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'Tên đăng nhập đã tồn tại' };
    }
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email đã được sử dụng' };
    }
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password,
        isAdmin: false
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Đăng ký thành công' };
}

// Đăng xuất
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForUser();
    window.location.href = 'index.html';
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

// Xuất hàm ra global
window.login = login;
window.register = register;
window.logout = logout;
window.currentUser = currentUser; // để các script khác dùng (cần tham chiếu qua biến này, nhưng do currentUser thay đổi nên dùng hàm getter)
// Cung cấp cách lấy currentUser an toàn
window.getCurrentUser = () => currentUser;

function isAdmin() {
    return currentUser && currentUser.isAdmin === true;
}

// Kiểm tra và cập nhật hiển thị nút đăng nhập/đăng xuất ở header
function updateAuthButtons() {
    const userInfo = document.getElementById('user-info');
    const guestButtons = document.getElementById('guest-buttons');
    const usernameDisplay = document.getElementById('username-display');
    
    if (currentUser) {
        if (userInfo) userInfo.style.display = 'flex';
        if (guestButtons) guestButtons.style.display = 'none';
        if (usernameDisplay) usernameDisplay.textContent = currentUser.username;
    } else {
        if (userInfo) userInfo.style.display = 'none';
        if (guestButtons) guestButtons.style.display = 'flex';
    }
}

// Gọi khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    updateAuthButtons();
});