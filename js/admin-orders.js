// js/admin-orders.js

// Load danh sách đơn hàng cho admin
function loadAdminOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('admin-orders-list');
    
    if (!tbody) {
        console.error('Không tìm thấy #admin-orders-list');
        return;
    }
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">Không có đơn hàng nào.</td></tr>';
        return;
    }
    
    // Sắp xếp đơn hàng mới nhất lên đầu
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    tbody.innerHTML = '';
    sortedOrders.forEach(order => {
        const row = createOrderRow(order);
        tbody.appendChild(row);
    });
    
    // Gắn lại sự kiện cho các nút
    attachOrderEvents();
}

// Tạo một dòng đơn hàng
function createOrderRow(order) {
    const tr = document.createElement('tr');
    tr.dataset.id = order.id;
    
    const statusText = getOrderStatusText(order.status);
    const statusClass = getOrderStatusClass(order.status);
    
    // Định dạng ngày giờ
    const orderDate = new Date(order.createdAt);
    const formattedDate = orderDate.toLocaleDateString('vi-VN') + ' ' + 
                         orderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    tr.innerHTML = `
        <td>#${order.id}</td>
        <td>${order.customerName || 'Khách'}</td>
        <td>${formattedDate}</td>
        <td>${formatCurrency(order.total || 0)}</td>
        <td>
            <span class="order-status ${statusClass}">${statusText}</span>
        </td>
        <td>${order.deliveryType === 'shipping' ? 'Giao hàng' : 'Tại cửa hàng'}</td>
        <td>${getPaymentMethodText(order.paymentMethod)}</td>
        <td>
            <div class="order-actions">
                <button class="btn btn-sm btn-outline view-order" data-id="${order.id}">
                    <i class="fas fa-eye"></i> Xem
                </button>
                <select class="status-select form-control" data-id="${order.id}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Đang xử lý</option>
                    <option value="approved" ${order.status === 'approved' ? 'selected' : ''}>Đã duyệt</option>
                    <option value="rejected" ${order.status === 'rejected' ? 'selected' : ''}>Từ chối</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Hoàn thành</option>
                </select>
            </div>
        </td>
    `;
    
    return tr;
}

// Lấy tên phương thức thanh toán
function getPaymentMethodText(method) {
    const map = {
        'cod': 'COD',
        'bank_transfer': 'Chuyển khoản',
        'card': 'Thẻ'
    };
    return map[method] || method;
}

// Lấy text trạng thái
function getOrderStatusText(status) {
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

// Lấy class CSS cho trạng thái
function getOrderStatusClass(status) {
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

// Gắn sự kiện cho các nút trong bảng
function attachOrderEvents() {
    // Xem chi tiết đơn hàng
    document.querySelectorAll('.view-order').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.dataset.id);
            viewOrderDetail(orderId);
        });
    });
    
    // Thay đổi trạng thái đơn hàng
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            const orderId = parseInt(this.dataset.id);
            const newStatus = this.value;
            updateOrderStatus(orderId, newStatus);
        });
    });
}

// Xem chi tiết đơn hàng
function viewOrderDetail(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showToast('Không tìm thấy đơn hàng', 'error');
        return;
    }
    
    // Tạo modal chi tiết đơn hàng
    let itemsHtml = '';
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            itemsHtml += `
                <tr>
                    <td>${item.name} ${item.color ? `(${item.color})` : ''}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price * item.quantity)}</td>
                </tr>
            `;
        });
    } else {
        itemsHtml = '<tr><td colspan="4" style="text-align: center;">Không có sản phẩm</td></tr>';
    }
    
    const statusText = getOrderStatusText(order.status);
    const statusClass = getOrderStatusClass(order.status);
    
    // Tạo modal
    const modalHtml = `
        <div id="order-detail-modal" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 800px;">
                <span class="close-modal" onclick="document.getElementById('order-detail-modal').remove()">&times;</span>
                <h2>Chi tiết đơn hàng #${order.id}</h2>
                
                <div class="order-info">
                    <h3>Thông tin khách hàng</h3>
                    <p><strong>Tên:</strong> ${order.customerName || 'Không có'}</p>
                    <p><strong>Email:</strong> ${order.customerEmail || 'Không có'}</p>
                    <p><strong>SĐT:</strong> ${order.customerPhone || 'Không có'}</p>
                </div>
                
                <div class="order-info">
                    <h3>Thông tin giao hàng</h3>
                    <p><strong>Hình thức:</strong> ${order.deliveryType === 'shipping' ? 'Giao tận nơi' : 'Nhận tại cửa hàng'}</p>
                    ${order.deliveryType === 'shipping' ? `
                        <p><strong>Địa chỉ:</strong> ${order.address || ''}</p>
                        ${order.note ? `<p><strong>Ghi chú:</strong> ${order.note}</p>` : ''}
                    ` : `
                        <p><strong>Cửa hàng:</strong> ${order.storeName || 'Không có'}</p>
                        <p><strong>Địa chỉ:</strong> ${order.storeAddress || 'Không có'}</p>
                    `}
                </div>
                
                <div class="order-info">
                    <h3>Sản phẩm</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                </div>
                
                <div class="order-info">
                    <h3>Thanh toán</h3>
                    <p><strong>Tạm tính:</strong> ${formatCurrency(order.subtotal || 0)}</p>
                    <p><strong>Phí vận chuyển:</strong> ${order.shipping === 0 ? 'Miễn phí' : formatCurrency(order.shipping || 0)}</p>
                    ${order.discount > 0 ? `<p><strong>Giảm giá:</strong> -${formatCurrency(order.discount)}</p>` : ''}
                    <p><strong>Tổng cộng:</strong> ${formatCurrency(order.total || 0)}</p>
                    <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethodText(order.paymentMethod)}</p>
                    <p><strong>Trạng thái:</strong> <span class="order-status ${statusClass}">${statusText}</span></p>
                    <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                </div>
            </div>
        </div>
    `;
    
    // Thêm modal vào body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Cập nhật trạng thái đơn hàng
function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index === -1) {
        showToast('Không tìm thấy đơn hàng', 'error');
        return;
    }
    
    const oldStatus = orders[index].status;
    orders[index].status = newStatus;
    orders[index].updatedAt = new Date().toISOString();
    
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Nếu đơn hàng được duyệt, cập nhật thành viên
    if (newStatus === 'approved' && oldStatus !== 'approved') {
        updateUserMemberLevel(orders[index].userId);
    }
    
    showToast(`Đã cập nhật trạng thái đơn hàng #${orderId} thành ${getOrderStatusText(newStatus)}`, 'success');
    loadAdminOrders(); // Tải lại danh sách
}

// Lọc đơn hàng theo trạng thái
function filterOrders(status) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('admin-orders-list');
    
    if (!tbody) return;
    
    const filtered = status === 'all' ? orders : orders.filter(o => o.status === status);
    
    tbody.innerHTML = '';
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">Không có đơn hàng nào.</td></tr>';
        return;
    }
    
    filtered.forEach(order => {
        const row = createOrderRow(order);
        tbody.appendChild(row);
    });
    
    attachOrderEvents();
}

// Gắn sự kiện cho bộ lọc
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.orders-filter .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const status = this.dataset.status;
            filterOrders(status);
        });
    });
});

// Hàm cập nhật cấp thành viên (cần thêm vào file admin-members.js)
function updateUserMemberLevel(userId) {
    // Hàm này sẽ được định nghĩa trong admin-members.js
    if (typeof window.updateMemberLevel === 'function') {
        window.updateMemberLevel(userId);
    }
}