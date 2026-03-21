// auth.js

let currentUser = null;

const SIDEBAR_ENABLED_PAGES = new Set([
    'index.html',
    'products.html',
    'news.html',
    'cart.html',
    'my-orders.html'
]);

function getCurrentPageFileName() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.endsWith('/')) return 'index.html';
    const parts = path.split('/');
    return parts[parts.length - 1] || 'index.html';
}

function isSidebarEnabledPage() {
    return SIDEBAR_ENABLED_PAGES.has(getCurrentPageFileName());
}

function setSidebarOpen(open) {
    const overlay = document.getElementById('user-sidebar-overlay');
    const sidebar = document.getElementById('user-sidebar');
    if (!overlay || !sidebar) return;
    if (open) {
        overlay.classList.add('active');
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
    } else {
        overlay.classList.remove('active');
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
    }
}

function ensureUserSidebar() {
    if (!isSidebarEnabledPage()) return;

    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    let trigger = document.getElementById('user-sidebar-trigger');
    if (!trigger) {
        trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.id = 'user-sidebar-trigger';
        trigger.className = 'user-sidebar-trigger';
        trigger.style.display = 'none';
        trigger.innerHTML = `
            <span class="user-sidebar-avatar"><i class="fa-solid fa-user"></i></span>
            <span class="user-sidebar-username"></span>
            <i class="fa-solid fa-chevron-down user-sidebar-chevron"></i>
        `;
        authButtons.prepend(trigger);
        trigger.addEventListener('click', () => setSidebarOpen(true));
    }

    if (!document.getElementById('user-sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'user-sidebar-overlay';
        overlay.className = 'user-sidebar-overlay';
        overlay.addEventListener('click', () => setSidebarOpen(false));
        document.body.appendChild(overlay);
    }

    if (!document.getElementById('user-sidebar')) {
        const sidebar = document.createElement('aside');
        sidebar.id = 'user-sidebar';
        sidebar.className = 'user-sidebar';
        sidebar.innerHTML = `
            <div class="user-sidebar-head">
                <div class="user-sidebar-profile">
                    <div class="user-sidebar-profile-avatar">
                        <i class="fa-solid fa-user-astronaut"></i>
                    </div>
                    <div class="user-sidebar-profile-meta">
                        <div class="user-sidebar-profile-name" id="user-sidebar-name"></div>
                        <div class="user-sidebar-profile-sub">ROG Member</div>
                    </div>
                </div>
                <button type="button" class="user-sidebar-close" id="user-sidebar-close" aria-label="Close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="user-sidebar-body">
                <a class="user-sidebar-action" href="my-orders.html">
                    <i class="fa-solid fa-receipt"></i>
                    <span>Đơn hàng của tôi</span>
                </a>
                <a class="user-sidebar-action" href="admin.html" id="user-sidebar-admin" style="display: none;">
                    <i class="fa-solid fa-user-shield"></i>
                    <span>Quản trị</span>
                </a>
            </div>
            <div class="user-sidebar-foot">
                <button type="button" class="user-sidebar-logout" id="user-sidebar-logout">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>Đăng xuất</span>
                </button>
            </div>
        `;
        document.body.appendChild(sidebar);

        const closeBtn = document.getElementById('user-sidebar-close');
        if (closeBtn) closeBtn.addEventListener('click', () => setSidebarOpen(false));

        const logoutBtn = document.getElementById('user-sidebar-logout');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
    }
}

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
    const guestButtons = document.getElementById('guest-buttons');
    const userOnlyItems = document.querySelectorAll('.user-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');

    if (currentUser) {
        // Đã đăng nhập
        if (guestButtons) guestButtons.style.display = 'none';

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
        if (guestButtons) guestButtons.style.display = 'flex';
        userOnlyItems.forEach(el => el.style.display = 'none');
        adminOnlyItems.forEach(el => el.style.display = 'none');
        setSidebarOpen(false);
    }

    ensureUserSidebar();
    const trigger = document.getElementById('user-sidebar-trigger');
    const nameEl = document.getElementById('user-sidebar-name');
    const adminLink = document.getElementById('user-sidebar-admin');

    if (trigger && isSidebarEnabledPage()) {
        if (currentUser) {
            trigger.style.display = 'inline-flex';
            const usernameEl = trigger.querySelector('.user-sidebar-username');
            if (usernameEl) usernameEl.textContent = currentUser.username;
        } else {
            trigger.style.display = 'none';
        }
    }
    if (nameEl) {
        nameEl.textContent = currentUser ? currentUser.username : '';
    }
    if (adminLink) {
        adminLink.style.display = currentUser?.isAdmin ? 'flex' : 'none';
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
