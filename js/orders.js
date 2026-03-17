// orders.js

function loadUserOrders() {
    const user = getCurrentUser();
    const notLoginMsg = document.getElementById('not-login-message');
    const filterDiv = document.getElementById('orders-filter');
    const listDiv = document.getElementById('user-orders-list');

    if (!user) {
        if (notLoginMsg) notLoginMsg.style.display = 'block';
        if (filterDiv) filterDiv.style.display = 'none';
        if (listDiv) listDiv.innerHTML = '';
        return;
    }

    if (notLoginMsg) notLoginMsg.style.display = 'none';
    if (filterDiv) filterDiv.style.display = 'flex';

    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = allOrders.filter(o => o.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (userOrders.length === 0) {
        listDiv.innerHTML = '<p class="no-data">Bạn chưa có đơn hàng nào.</p>';
        return;
    }

    renderUserOrders(userOrders);
}

function renderUserOrders(orders) {
    const listDiv = document.getElementById('user-orders-list');
    listDiv.innerHTML = orders.map(order => createOrderCard(order)).join('');
    attachOrderEvents();
}

function createOrderCard(order) {
    const statusText = getStatusText(order.status);
    const statusClass = getStatusClass(order.status);
    const itemsHtml = order.items.map(item => `
        <div class="order-item">
            <span>${item.name} ${item.color ? '('+item.color+')' : ''} x${item.quantity}</span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    return `
        <div class="order-card" data-id="${order.id}" data-status="${order.status}">
            <div class="order-header">
                <span class="order-id">Đơn hàng #${order.id}</span>
                <span class="order-date">${new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                <span class="order-status ${statusClass}">${statusText}</span>
            </div>
            <div class="order-body">
                <div class="order-items">${itemsHtml}</div>
                <div class="order-summary">
                    <p><strong>Tổng cộng:</strong> ${formatCurrency(order.total)}</p>
                    <p><strong>Thanh toán:</strong> ${getPaymentMethodText(order.paymentMethod)}</p>
                    <p><strong>Giao hàng:</strong> ${order.deliveryType === 'shipping' ? 'Giao tận nơi' : 'Nhận tại cửa hàng'}</p>
                </div>
            </div>
            <div class="order-footer">
                <button class="btn btn-outline view-order-detail" data-id="${order.id}">Xem chi tiết</button>
                ${order.status === 'pending' ? `<button class="btn btn-danger cancel-order" data-id="${order.id}">Hủy đơn</button>` : ''}
                ${order.status === 'approved' ? '<span class="success-badge"><i class="fas fa-check-circle"></i> Đã duyệt</span>' : ''}
                ${order.status === 'rejected' ? '<span class="error-badge"><i class="fas fa-times-circle"></i> Bị từ chối</span>' : ''}
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
        'card': 'Thẻ'
    };
    return map[method] || method;
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
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}