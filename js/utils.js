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
        'laptop': 'Laptop Gaming',
        'monitor': 'Màn hình Gaming',
        'keyboard': 'Bàn phím Gaming',
        'mouse': 'Chuột Gaming',
        'headphone': 'Tai nghe Gaming'
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

function setupNewsletterForms() {
    const forms = document.querySelectorAll('form.newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[name="email"]');
            const email = (emailInput?.value || '').trim();
            if (!email || !email.includes('@') || !email.includes('.')) {
                showToast('Vui lòng nhập email hợp lệ.', 'error');
                return;
            }
            const stored = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
            if (!stored.includes(email)) {
                stored.push(email);
                localStorage.setItem('newsletter_emails', JSON.stringify(stored));
            }
            if (emailInput) emailInput.value = '';
            showToast('Đã đăng ký nhận thông báo thành công!', 'success');
        });
    });
}

document.addEventListener('DOMContentLoaded', setupNewsletterForms);

function setupBackButton() {
    if (document.getElementById('back-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'back-btn';
    btn.className = 'back-btn';
    btn.type = 'button';
    btn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    btn.addEventListener('click', () => {
        if (window.history.length > 1) {
            window.history.back();
            return;
        }
        window.location.href = 'index.html';
    });
    document.body.appendChild(btn);

    const toggle = () => {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        btn.classList.toggle('show', y > 180);
    };
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
}

document.addEventListener('DOMContentLoaded', setupBackButton);

// --- BOT CHAT ZALO GIẢ LẬP TRÊN WEB ---
function addZaloChatWidget() {
    const zaloHTML = `
        <div id="zalo-chat-container">
            <div id="zalo-chat-box" class="zalo-chat-box">
                <div class="zalo-chat-header">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" alt="Zalo">
                    <div class="zalo-header-info">
                        <strong>TechStore Support</strong>
                        <span>Vừa mới truy cập</span>
                    </div>
                    <button id="zalo-close-btn">&times;</button>
                </div>
                <div id="zalo-chat-messages" class="zalo-chat-messages">
                    <div class="chat-message bot-message">Chào bạn! Mình là trợ lý ảo của TechStore. Mình có thể giúp gì cho bạn?</div>
                </div>
                <div class="zalo-chat-input-area">
                    <input type="text" id="zalo-chat-input" placeholder="Nhập tin nhắn..." autocomplete="off">
                    <button id="zalo-send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>

            <div id="zalo-chat-btn" class="zalo-chat-widget" style="cursor: pointer;">
                <div class="zalo-icon-wrap">
                    <div class="zalo-animation-bg"></div>
                    <div class="zalo-animation-ring"></div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" alt="Zalo Chat">
                </div>
                <span class="zalo-tooltip">Chat với chúng tôi!</span>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', zaloHTML);

    // Gắn sự kiện đóng/mở chat
    const chatBtn = document.getElementById('zalo-chat-btn');
    const closeBtn = document.getElementById('zalo-close-btn');
    const chatBox = document.getElementById('zalo-chat-box');
    const sendBtn = document.getElementById('zalo-send-btn');
    const chatInput = document.getElementById('zalo-chat-input');
    const messagesContainer = document.getElementById('zalo-chat-messages');

    chatBtn.addEventListener('click', () => {
        chatBox.classList.add('active');
        chatBtn.style.display = 'none'; // Ẩn nút Zalo khi khung chat mở lên
    });

    closeBtn.addEventListener('click', () => {
        chatBox.classList.remove('active');
        chatBtn.style.display = 'flex'; // Hiện lại nút Zalo
    });

    // Hàm gửi tin nhắn và Bot tự trả lời
    function sendMessage() {
        const text = chatInput.value.trim();
        if(!text) return;

        // 1. In tin nhắn của người dùng ra màn hình
        messagesContainer.innerHTML += `<div class="chat-message user-message">${text}</div>`;
        chatInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Cuộn xuống cuối

        // 2. Giả lập Bot "đang gõ" và trả lời sau 1.5 giây
        setTimeout(() => {
            // Danh sách các câu trả lời ngẫu nhiên của Bot
            const replies = [
                "Dạ vâng, TechStore đã nhận được thông tin của bạn ạ.",
                "Bạn đợi một chút nhé, nhân viên tư vấn sẽ kiểm tra và hỗ trợ bạn ngay.",
                "Dạ mẫu laptop này bên mình hiện đang có sẵn hàng tại chi nhánh TP.HCM ạ.",
                "Bên mình đang có chương trình tặng balo ROG và chuột gaming đó ạ, bạn có muốn đặt luôn không?",
                "Cảm ơn bạn quan tâm! Bạn có cần mình tư vấn thêm về cấu hình máy không ạ?",
                "Dạ giá trên web là giá đã bao gồm VAT và ưu đãi rồi đó ạ."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            messagesContainer.innerHTML += `<div class="chat-message bot-message">${randomReply}</div>`;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1500);
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendMessage();
    });
}

// Chạy hàm khi trang tải xong (nếu chưa có dòng này thì để nguyên)
document.addEventListener('DOMContentLoaded', addZaloChatWidget);