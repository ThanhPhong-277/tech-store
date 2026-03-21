// orders.js

let activeUserOrderFilter = 'all';

function loadUserOrders() {
    const user = getCurrentUser();
    const notLoginMsg = document.getElementById('not-login-message');
    const filterDiv = document.getElementById('orders-filter');
    const listDiv = document.getElementById('user-orders-list');
    const statsDiv = document.getElementById('orders-stats');

    if (!user) {
        if (notLoginMsg) notLoginMsg.style.display = 'block';
        if (filterDiv) filterDiv.style.display = 'none';
        if (statsDiv) statsDiv.style.display = 'none';
        if (listDiv) listDiv.innerHTML = '';
        return;
    }

    if (notLoginMsg) notLoginMsg.style.display = 'none';
    if (filterDiv) filterDiv.style.display = 'flex';

    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = allOrders.filter(o => o.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    renderOrderStats(userOrders);

    if (userOrders.length === 0) {
        if (filterDiv) filterDiv.style.display = 'none';
        listDiv.innerHTML = `
            <div class="orders-empty">
                <div class="orders-empty-icon"><i class="fa-solid fa-bag-shopping"></i></div>
                <h2>Bạn chưa có đơn hàng nào</h2>
                <p>Khám phá hệ sinh thái ASUS ROG và đặt đơn hàng đầu tiên ngay hôm nay.</p>
                <a class="btn btn-primary" href="products.html">Xem sản phẩm</a>
            </div>
        `;
        return;
    }

    renderUserOrders(userOrders);
    initOrderFilter(userOrders);
}

function renderUserOrders(orders) {
    const listDiv = document.getElementById('user-orders-list');
    listDiv.innerHTML = orders.map(order => createOrderCard(order)).join('');
    attachOrderEvents();
    filterUserOrders(activeUserOrderFilter);
}

function createOrderCard(order) {
    const statusText = getStatusText(order.status);
    const statusClass = getStatusClass(order.status);
    const itemsPreview = (order.items || []).slice(0, 3);
    const remainingCount = Math.max(0, (order.items || []).length - itemsPreview.length);
    const previewHtml = itemsPreview.map(item => `
        <div class="order-item-row">
            <span class="order-item-name">${item.name}${item.color ? ` <span class="order-item-color">(${item.color})</span>` : ''}</span>
            <span class="order-item-qty">x${item.quantity}</span>
        </div>
    `).join('');
    const moreHtml = remainingCount > 0 ? `<div class="order-item-more">+${remainingCount} sản phẩm khác</div>` : '';

    return `
        <div class="order-card" data-id="${order.id}" data-status="${order.status}">
            <div class="order-top">
                <div class="order-top-left">
                    <div class="order-code">#${order.id}</div>
                    <div class="order-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                        <span><i class="fa-solid fa-truck-fast"></i> ${order.deliveryType === 'shipping' ? 'Giao tận nơi' : 'Nhận tại cửa hàng'}</span>
                        <span><i class="fa-solid fa-credit-card"></i> ${getPaymentMethodText(order.paymentMethod)}</span>
                    </div>
                </div>
                <div class="order-top-right">
                    <span class="order-status-pill ${statusClass}">${statusText}</span>
                    <div class="order-total">${formatCurrency(order.total)}</div>
                </div>
            </div>
            <div class="order-divider"></div>
            <div class="order-items-preview">
                ${previewHtml}
                ${moreHtml}
            </div>
            <div class="order-actions">
                <button class="btn btn-outline view-order-detail" data-id="${order.id}"><i class="fa-solid fa-magnifying-glass"></i> Chi tiết</button>
                ${order.status === 'pending' ? `<button class="btn btn-danger cancel-order" data-id="${order.id}"><i class="fa-solid fa-ban"></i> Hủy đơn</button>` : ''}
            </div>
        </div>
    `;
}

function getStatusText(status) {
    const map = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'approved': 'Đã duyệt',
        'rejected': 'Từ chối',
        'cancelled': 'Đã hủy',
        'completed': 'Hoàn thành'
    };
    return map[status] || status;
}

function getStatusClass(status) {
    const map = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'approved': 'status-approved',
        'rejected': 'status-rejected',
        'cancelled': 'status-cancelled',
        'completed': 'status-completed'
    };
    return map[status] || '';
}

function getPaymentMethodText(method) {
    const map = {
        'cod': 'Thanh toán khi nhận hàng',
        'bank': 'Chuyển khoản',
        'bank_transfer': 'Chuyển khoản',
        'card': 'Thẻ'
    };
    return map[method] || method;
}

function initOrderFilter(orders) {
    const filterDiv = document.getElementById('orders-filter');
    if (!filterDiv) return;

    const buttons = Array.from(filterDiv.querySelectorAll('.filter-btn'));
    const activeBtn = buttons.find(b => b.dataset.status === activeUserOrderFilter);
    if (activeBtn) {
        buttons.forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    if (filterDiv.dataset.bound === 'true') return;
    filterDiv.dataset.bound = 'true';

    filterDiv.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        const status = btn.dataset.status || 'all';
        activeUserOrderFilter = status;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterUserOrders(status);
        updateFilterCounter(orders, status);
    });

    updateFilterCounter(orders, activeUserOrderFilter);
}

function updateFilterCounter(orders, status) {
    const listDiv = document.getElementById('user-orders-list');
    if (!listDiv) return;
    const visibleCount = status === 'all' ? orders.length : orders.filter(o => o.status === status).length;
    listDiv.dataset.visibleCount = String(visibleCount);
}

function renderOrderStats(orders) {
    const statsDiv = document.getElementById('orders-stats');
    if (!statsDiv) return;

    const countBy = (status) => orders.filter(o => o.status === status).length;
    const total = orders.length;
    const pending = countBy('pending');
    const processing = countBy('processing');
    const approved = countBy('approved');
    const completed = countBy('completed');

    statsDiv.style.display = 'grid';
    statsDiv.innerHTML = `
        <div class="orders-stat stat-total">
            <div class="orders-stat-icon"><i class="fa-solid fa-layer-group"></i></div>
            <div class="orders-stat-meta">
                <div class="orders-stat-label">Tổng đơn</div>
                <div class="orders-stat-value">${total}</div>
            </div>
        </div>
        <div class="orders-stat stat-pending">
            <div class="orders-stat-icon"><i class="fa-solid fa-hourglass-half"></i></div>
            <div class="orders-stat-meta">
                <div class="orders-stat-label">Chờ xử lý</div>
                <div class="orders-stat-value">${pending}</div>
            </div>
        </div>
        <div class="orders-stat stat-processing">
            <div class="orders-stat-icon"><i class="fa-solid fa-gears"></i></div>
            <div class="orders-stat-meta">
                <div class="orders-stat-label">Đang xử lý</div>
                <div class="orders-stat-value">${processing}</div>
            </div>
        </div>
        <div class="orders-stat stat-approved">
            <div class="orders-stat-icon"><i class="fa-solid fa-circle-check"></i></div>
            <div class="orders-stat-meta">
                <div class="orders-stat-label">Đã duyệt</div>
                <div class="orders-stat-value">${approved}</div>
            </div>
        </div>
        <div class="orders-stat stat-completed">
            <div class="orders-stat-icon"><i class="fa-solid fa-trophy"></i></div>
            <div class="orders-stat-meta">
                <div class="orders-stat-label">Hoàn thành</div>
                <div class="orders-stat-value">${completed}</div>
            </div>
        </div>
    `;
}

function attachOrderEvents() {
    document.querySelectorAll('.cancel-order').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.dataset.id);
            cancelOrder(orderId);
        });
    });
    document.querySelectorAll('.view-order-detail').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.dataset.id);
            showOrderDetail(orderId);
        });
    });
}

function cancelOrder(orderId) {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return;
    if (orders[index].status !== 'pending') {
        showToast('Chỉ có thể hủy đơn hàng đang chờ xử lý', 'error');
        return;
    }
    orders[index].status = 'cancelled';
    orders[index].updatedAt = new Date().toISOString();
    localStorage.setItem('orders', JSON.stringify(orders));
    loadUserOrders();
    showToast('Đã hủy đơn hàng', 'success');
}

function showOrderDetail(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Chi tiết đơn hàng #${order.id}</h2>
            <div class="order-detail">
                <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                <p><strong>Trạng thái:</strong> <span class="order-status ${getStatusClass(order.status)}">${getStatusText(order.status)}</span></p>
                <p><strong>Khách hàng:</strong> ${order.customerName}</p>
                <p><strong>Điện thoại:</strong> ${order.customerPhone || 'Không có'}</p>
                <p><strong>Email:</strong> ${order.customerEmail}</p>
                <p><strong>Hình thức giao hàng:</strong> ${order.deliveryType === 'shipping' ? 'Giao tận nơi' : 'Nhận tại cửa hàng'}</p>
                ${order.deliveryType === 'shipping' ? `
                    <p><strong>Địa chỉ:</strong> ${order.address}, ${order.ward}, ${order.district}, ${order.province}</p>
                ` : `
                    <p><strong>Cửa hàng:</strong> ${order.storeId}</p>
                `}
                <p><strong>Ghi chú:</strong> ${order.note || 'Không có'}</p>
                <h3>Sản phẩm</h3>
                <table class="table">
                    <thead><tr><th>Sản phẩm</th><th>Màu</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.color || ''}</td>
                                <td>${item.quantity}</td>
                                <td>${formatCurrency(item.price)}</td>
                                <td>${formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="order-total">
                    <p><strong>Tạm tính:</strong> ${formatCurrency(order.subtotal)}</p>
                    <p><strong>Phí vận chuyển:</strong> ${order.shipping === 0 ? 'Miễn phí' : formatCurrency(order.shipping)}</p>
                    ${order.discount > 0 ? `<p><strong>Giảm giá:</strong> -${formatCurrency(order.discount)}</p>` : ''}
                    <p><strong>Tổng cộng:</strong> ${formatCurrency(order.total)}</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// Filter orders
function filterUserOrders(status) {
    const cards = document.querySelectorAll('.order-card');
    cards.forEach(card => {
        if (status === 'all' || card.dataset.status === status) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
