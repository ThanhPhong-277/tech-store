// js/admin.js
let quillEditor;

document.addEventListener('DOMContentLoaded', function () {

    // Khởi tạo Trình soạn thảo Word cho Tin tức
    if (document.getElementById('news-editor')) {
        quillEditor = new Quill('#news-editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
                    ['link', 'image', 'video'],
                    ['clean']
                ]
            },
            placeholder: 'Soạn thảo hoặc dán nội dung từ mạng (kèm hình ảnh) vào đây...'
        });
    }
});

let currentAdminSection = 'dashboard';

document.addEventListener('DOMContentLoaded', function () {
    // Kiểm tra quyền admin
    if (!isAdmin()) {
        window.location.href = 'index.html';
        return;
    }

    // Hiển thị tên admin
    const user = getCurrentUser();
    document.getElementById('admin-name').textContent = user?.username || 'Admin';

    // Khởi tạo các section
    initializeDashboard();
    loadProductsSection();
    loadOrdersSection();
    loadVouchersSection();
    loadMembersSection();
    loadStoresSection();
    loadNewsSection();

    // Xử lý chuyển đổi menu
    document.querySelectorAll('.menu-item[data-section]').forEach(item => {
        item.addEventListener('click', function () {
            const section = this.dataset.section;
            switchSection(section);
        });
    });

    // Xử lý đăng xuất
    document.getElementById('admin-logout').addEventListener('click', logout);

    // Xử lý nút làm mới
    document.getElementById('refresh-data').addEventListener('click', function () {
        refreshCurrentSection();
    });

    // Cập nhật số lượng giỏ hàng
    updateCartCount();
});

// Chuyển đổi section
function switchSection(section) {
    // Cập nhật active menu
    document.querySelectorAll('.menu-item[data-section]').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.menu-item[data-section="${section}"]`).classList.add('active');

    // Cập nhật active section
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');

    // Cập nhật tiêu đề
    const titles = {
        'dashboard': 'Tổng quan',
        'products': 'Quản lý sản phẩm',
        'orders': 'Quản lý đơn hàng',
        'vouchers': 'Quản lý voucher',
        'members': 'Quản lý thành viên',
        'stores': 'Quản lý cửa hàng',
        'news': 'Quản lý tin tức',
        'settings': 'Cài đặt'
    };
    document.getElementById('page-title').textContent = titles[section] || 'Admin';

    currentAdminSection = section;
}

// Làm mới section hiện tại
function refreshCurrentSection() {
    switch (currentAdminSection) {
        case 'dashboard':
            initializeDashboard();
            break;
        case 'products':
            loadProductsSection();
            break;
        case 'orders':
            loadOrdersSection();
            break;
        case 'vouchers':
            loadVouchersSection();
            break;
        case 'members':
            loadMembersSection();
            break;
        case 'stores':
            loadStoresSection();
            break;
        case 'news':
            loadNewsSection();
            break;
    }
    showToast('Đã làm mới dữ liệu', 'success');
}

// Khởi tạo dashboard
function initializeDashboard() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Thống kê
    document.getElementById('total-products').textContent = products.length;

    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    document.getElementById('today-orders').textContent = todayOrders.length;

    document.getElementById('total-members').textContent = users.filter(u => !u.isAdmin).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = orders
        .filter(o => o.status === 'completed' || o.status === 'approved')
        .filter(o => {
            const d = new Date(o.createdAt);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, o) => sum + (o.total || 0), 0);
    document.getElementById('monthly-revenue').textContent = formatCurrency(monthlyRevenue);

    // Đơn hàng gần đây
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const recentList = document.getElementById('recent-orders-list');
    recentList.innerHTML = recentOrders.length ? recentOrders.map(o => `
        <div class="recent-item">
            <div class="recent-info">
                <h4>#${o.id} - ${o.customerName}</h4>
                <p>${new Date(o.createdAt).toLocaleString('vi-VN')}</p>
            </div>
            <div class="recent-price">${formatCurrency(o.total || 0)}</div>
        </div>
    `).join('') : '<p>Chưa có đơn hàng</p>';

    // Sản phẩm sắp hết hàng
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).slice(0, 5);
    const lowStockList = document.getElementById('low-stock-list');
    lowStockList.innerHTML = lowStock.length ? lowStock.map(p => `
        <div class="recent-item">
            <div class="recent-info">
                <h4>${p.name}</h4>
                <p>Còn ${p.stock} sản phẩm</p>
            </div>
            <div class="recent-price">${formatCurrency(p.price)}</div>
        </div>
    `).join('') : '<p>Không có sản phẩm nào sắp hết hàng</p>';
}

// Load sản phẩm
function loadProductsSection() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tbody = document.getElementById('products-list');

    tbody.innerHTML = products.length ? products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.image}" alt="${p.name}" width="50" height="50" style="object-fit: cover;"></td>
            <td>${p.name}</td>
            <td>${getCategoryName(p.category)}</td>
            <td>${formatCurrency(p.price)}</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn btn-sm btn-outline edit-product" data-id="${p.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-product" data-id="${p.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="7" style="text-align: center;">Chưa có sản phẩm</td></tr>';

    // Gắn sự kiện
    document.querySelectorAll('.edit-product').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });

    // Load cửa hàng cho select
    loadStoreOptions();
}

// Load đơn hàng (Bản nâng cấp có chức năng Lọc)
function loadOrdersSection(forcedStatus = null) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('orders-list');
    if (!tbody) return;

    // 1. Tự động kiểm tra xem nút lọc nào đang được ấn (active)
    let currentStatus = forcedStatus;
    if (!currentStatus) {
        const activeFilter = document.querySelector('.filter-bar .filter-btn.active');
        currentStatus = activeFilter ? activeFilter.dataset.status : 'all';
    }

    // 2. Lọc đơn hàng theo trạng thái
    let filteredOrders = orders;
    if (currentStatus !== 'all') {
        filteredOrders = orders.filter(o => o.status === currentStatus);
    }

    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">Không có đơn hàng nào phù hợp với bộ lọc</td></tr>';
        return;
    }

    // 3. Sắp xếp đơn mới nhất lên đầu và in ra bảng
    const sorted = [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = sorted.map(order => {
        const statusClass = getOrderStatusClass(order.status);
        const statusText = getOrderStatusText(order.status);

        return `
            <tr>
                <td>#${order.id}</td>
                <td><strong>${order.customerName || 'Khách'}</strong></td>
                <td>${new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                <td>${typeof formatCurrency === 'function' ? formatCurrency(order.total || 0) : order.total}</td>
                <td><span class="order-status ${statusClass}">${statusText}</span></td>
                <td>${order.deliveryType === 'shipping' ? 'Giao hàng' : 'Tại cửa hàng'}</td>
                <td>${getPaymentMethodText(order.paymentMethod)}</td>
                <td>
                    <button class="btn btn-sm btn-outline view-order" data-id="${order.id}">
                        <i class="fas fa-eye"></i> Xem
                    </button>
                    <select class="status-select" data-id="${order.id}" style="margin-top: 0.5rem; padding: 4px; border-radius: 4px;">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Đang xử lý</option>
                        <option value="approved" ${order.status === 'approved' ? 'selected' : ''}>Đã duyệt</option>
                        <option value="rejected" ${order.status === 'rejected' ? 'selected' : ''}>Từ chối</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Hoàn thành</option>
                    </select>
                </td>
            </tr>
        `;
    }).join('');

    // 4. Gắn lại sự kiện cho các nút trong bảng
    document.querySelectorAll('.view-order').forEach(btn => {
        btn.addEventListener('click', () => viewOrderDetail(btn.dataset.id));
    });
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function () {
            updateOrderStatus(this.dataset.id, this.value);
        });
    });
}

// Load voucher
function loadVouchersSection() {
    const vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    const tbody = document.getElementById('vouchers-list');

    tbody.innerHTML = vouchers.length ? vouchers.map(v => `
        <tr>
            <td>${v.id}</td>
            <td>${v.code}</td>
            <td>${v.type === 'percent' ? v.value + '%' : formatCurrency(v.value)}</td>
            <td>${v.minOrder ? formatCurrency(v.minOrder) : 'Không'}</td>
            <td>${v.expiry || 'Không hạn'}</td>
            <td><span class="badge ${v.active ? 'badge-success' : 'badge-danger'}">${v.active ? 'Hoạt động' : 'Vô hiệu'}</span></td>
            <td>
                <button class="btn btn-sm btn-outline edit-voucher" data-id="${v.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-voucher" data-id="${v.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="7" style="text-align: center;">Chưa có voucher</td></tr>';
}

// Load thành viên
function loadMembersSection() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const members = users.filter(u => !u.isAdmin);

    const tbody = document.getElementById('members-list');

    tbody.innerHTML = members.length ? members.map(m => {
        // Tính số sản phẩm đã mua và tổng chi tiêu
        const userOrders = orders.filter(o => o.userId === m.id && (o.status === 'approved' || o.status === 'completed'));
        const totalProducts = userOrders.reduce((sum, o) => sum + (o.items?.reduce((s, i) => s + i.quantity, 0) || 0), 0);
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        const memberLevel = calculateMemberLevel(totalProducts);
        const levelNumber = Math.floor(totalProducts / 10) + 1;

        return `
            <tr>
                <td>${m.id}</td>
                <td>${m.username}</td>
                <td>${m.email}</td>
                <td><span class="member-badge badge-${memberLevel.class}">${memberLevel.name}</span></td>
                <td>Level ${levelNumber}</td>
                <td>${totalProducts}</td>
                <td>${formatCurrency(totalSpent)}</td>
                <td>
                    <button class="btn btn-sm btn-outline view-member" data-id="${m.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('') : '<tr><td colspan="8" style="text-align: center;">Không có thành viên</td></tr>';

    // THÊM ĐOẠN NÀY ĐỂ GẮN SỰ KIỆN CLICK CHO NÚT "XEM"
    document.querySelectorAll('.view-member').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            viewMember(this.dataset.id);
        });
    });
}

// Hàm hiển thị chi tiết thành viên
function viewMember(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    const user = users.find(u => String(u.id) === String(userId));
    if (!user) {
        if (typeof showToast === 'function') showToast('Không tìm thấy thành viên', 'error');
        return;
    }

    // Lấy toàn bộ lịch sử đơn hàng của người này (trừ đơn nháp)
    const userOrders = orders.filter(o => String(o.userId) === String(userId) && o.status !== 'cart');
    const totalSpent = userOrders
        .filter(o => o.status === 'approved' || o.status === 'completed')
        .reduce((sum, o) => sum + (o.total || 0), 0);

    // Tạo HTML bảng lịch sử mua hàng
    let ordersHtml = userOrders.length ? userOrders.map(o => `
        <tr>
            <td>#${o.id}</td>
            <td>${new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
            <td>${formatCurrency(o.total || 0)}</td>
            <td><span class="order-status ${getOrderStatusClass(o.status)}">${getOrderStatusText(o.status)}</span></td>
        </tr>
    `).join('') : '<tr><td colspan="4" style="text-align: center;">Thành viên này chưa có đơn hàng nào</td></tr>';

    // Tận dụng lại order-modal đã có sẵn bên trang HTML để hiển thị
    const modal = document.getElementById('order-modal');
    const content = document.getElementById('order-detail-content');

    if (modal && content) {
        content.innerHTML = `
            <h2>Hồ Sơ Thành Viên #${user.id}</h2>
            <div class="order-info" style="margin-bottom: 20px;">
                <p><strong>Tên đăng nhập:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Ngày tham gia:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}</p>
                <p><strong>Tổng chi tiêu thực tế:</strong> <span style="color: #ff007f; font-weight: bold;">${formatCurrency(totalSpent)}</span></p>
            </div>
            
            <h3>Lịch Sử Đơn Hàng</h3>
            <div style="max-height: 300px; overflow-y: auto;">
                <table class="table" style="width: 100%;">
                    <thead style="position: sticky; top: 0; background: #1c1b1b;">
                        <tr>
                            <th>Mã ĐH</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>${ordersHtml}</tbody>
                </table>
            </div>
        `;

        modal.style.display = 'flex';
        modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
    } else {
        // Fallback dự phòng nếu không tìm thấy modal
        alert(`THÀNH VIÊN: ${user.username}\nEmail: ${user.email}\nTổng chi tiêu: ${formatCurrency(totalSpent)}\nSố đơn hàng: ${userOrders.length}`);
    }
}

// Load cửa hàng
function loadStoresSection() {
    const stores = JSON.parse(localStorage.getItem('stores')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

    const tbody = document.getElementById('stores-list');

    tbody.innerHTML = stores.length ? stores.map(s => {
        const productCount = s.products ? s.products.length : 0;
        return `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.address}</td>
                <td>${s.phone}</td>
                <td>${productCount}</td>
                <td>
                    <button class="btn btn-sm btn-outline edit-store" data-id="${s.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-store" data-id="${s.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('') : '<tr><td colspan="6" style="text-align: center;">Chưa có cửa hàng</td></tr>';
}

const NEWS_POSTS_KEY = 'news_posts';

function getNewsPosts() {
    const raw = localStorage.getItem(NEWS_POSTS_KEY);
    try {
        const parsed = JSON.parse(raw || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function saveNewsPosts(posts) {
    localStorage.setItem(NEWS_POSTS_KEY, JSON.stringify(posts));
}

function openNewsForm(post) {
    const container = document.getElementById('news-form-container');
    const titleEl = document.getElementById('news-form-title');
    const form = document.getElementById('news-form');
    if (!container || !titleEl || !form) return;

    document.getElementById('news-id').value = post ? String(post.id) : '';
    document.getElementById('news-title').value = post ? (post.title || '') : '';
    document.getElementById('news-image').value = post ? (post.image || '') : '';
    if (quillEditor) {
        quillEditor.root.innerHTML = post ? (post.content || '') : '';
    }

    titleEl.textContent = post ? 'Sửa bài viết' : 'Thêm bài viết mới';
    container.style.display = 'block';
}

function closeNewsForm() {
    const container = document.getElementById('news-form-container');
    if (container) container.style.display = 'none';
}

function loadNewsSection() {
    const posts = getNewsPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const tbody = document.getElementById('news-list');
    if (!tbody) return;

    tbody.innerHTML = posts.length ? posts.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.image}" alt="${p.title}" width="60" height="42" style="object-fit: cover; border-radius: 6px;"></td>
            <td>${p.title}</td>
            <td>${p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : ''}</td>
            <td>
                <button class="btn btn-sm btn-outline edit-news" data-id="${p.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-news" data-id="${p.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="5" style="text-align: center;">Chưa có bài viết</td></tr>';

    if (tbody.dataset.bound !== 'true') {
        tbody.dataset.bound = 'true';
        tbody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-news');
            const deleteBtn = e.target.closest('.delete-news');
            const id = editBtn?.dataset.id || deleteBtn?.dataset.id;
            if (!id) return;
            const all = getNewsPosts();
            const post = all.find(x => String(x.id) === String(id));
            if (editBtn) {
                if (!post) return;
                openNewsForm(post);
                return;
            }
            if (deleteBtn) {
                if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
                const next = all.filter(x => String(x.id) !== String(id));
                saveNewsPosts(next);
                loadNewsSection();
                showToast('Đã xóa bài viết', 'success');
            }
        });
    }
}

document.getElementById('add-news-btn')?.addEventListener('click', () => {
    openNewsForm(null);
});

document.getElementById('cancel-news-form')?.addEventListener('click', () => {
    closeNewsForm();
});

document.getElementById('news-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const idRaw = document.getElementById('news-id')?.value || '';
    const title = (document.getElementById('news-title')?.value || '').trim();
    const image = (document.getElementById('news-image')?.value || '').trim();
    // LẤY NỘI DUNG TỪ EDITOR:
    const content = quillEditor ? quillEditor.root.innerHTML : '';

    if (!title || !image || !content || content === '<p><br></p>') {
        showToast('Vui lòng nhập đủ thông tin', 'error');
        return;
    }

    const posts = getNewsPosts();
    const now = new Date().toISOString();
    if (idRaw) {
        const idx = posts.findIndex(p => String(p.id) === String(idRaw));
        if (idx >= 0) {
            posts[idx] = { ...posts[idx], title, image, content, updatedAt: now };
            saveNewsPosts(posts);
            closeNewsForm();
            loadNewsSection();
            showToast('Cập nhật bài viết thành công', 'success');
            return;
        }
    }
    const nextId = posts.length ? Math.max(...posts.map(p => Number(p.id) || 0)) + 1 : 1;
    posts.push({ id: nextId, title, image, content, createdAt: now, updatedAt: now });
    saveNewsPosts(posts);
    closeNewsForm();
    loadNewsSection();
    showToast('Thêm bài viết thành công', 'success');
});

// Các hàm xử lý sản phẩm
document.getElementById('add-product-btn').addEventListener('click', () => {
    document.getElementById('product-form-container').style.display = 'block';
    document.getElementById('form-title').textContent = 'Thêm sản phẩm mới';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
});

document.getElementById('cancel-product-form').addEventListener('click', () => {
    document.getElementById('product-form-container').style.display = 'none';
});

document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('product-name').value.trim(),
        category: document.getElementById('product-category').value,
        price: parseInt(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        description: document.getElementById('product-description').value.trim(),
        colors: document.getElementById('product-colors').value.split(',').map(c => c.trim()).filter(c => c),
        image: document.getElementById('product-image').value.trim()
    };

    let products = JSON.parse(localStorage.getItem('products')) || [];

    if (id) {
        const index = products.findIndex(p => p.id == id);
        if (index >= 0) {
            products[index] = { ...products[index], ...productData };
            showToast('Cập nhật sản phẩm thành công', 'success');
        }
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, ...productData });
        showToast('Thêm sản phẩm thành công', 'success');
    }

    localStorage.setItem('products', JSON.stringify(products));
    document.getElementById('product-form-container').style.display = 'none';
    loadProductsSection();
});

function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const prod = products.find(p => p.id == id);
    if (!prod) return;

    document.getElementById('product-id').value = prod.id;
    document.getElementById('product-name').value = prod.name;
    document.getElementById('product-category').value = prod.category;
    document.getElementById('product-price').value = prod.price;
    document.getElementById('product-stock').value = prod.stock;
    document.getElementById('product-description').value = prod.description;
    document.getElementById('product-colors').value = prod.colors ? prod.colors.join(', ') : '';
    document.getElementById('product-image').value = prod.image;

    document.getElementById('form-title').textContent = 'Sửa sản phẩm';
    document.getElementById('product-form-container').style.display = 'block';
}

function deleteProduct(id) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id != id);
    localStorage.setItem('products', JSON.stringify(products));
    loadProductsSection();
    showToast('Đã xóa sản phẩm', 'success');
}

// Các hàm xử lý đơn hàng
function viewOrderDetail(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id == orderId);
    if (!order) return;

    let itemsHtml = '';
    if (order.items && order.items.length) {
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
    }

    const modal = document.getElementById('order-modal');
    const content = document.getElementById('order-detail-content');

    content.innerHTML = `
        <h2>Chi tiết đơn hàng #${order.id}</h2>
        <div class="order-info">
            <p><strong>Khách hàng:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>SĐT:</strong> ${order.customerPhone}</p>
        </div>
        <div class="order-info">
            <p><strong>Hình thức:</strong> ${order.deliveryType === 'shipping' ? 'Giao hàng' : 'Nhận tại cửa hàng'}</p>
            ${order.deliveryType === 'shipping' ? `
                <p><strong>Địa chỉ:</strong> ${order.address}</p>
                ${order.note ? `<p><strong>Ghi chú:</strong> ${order.note}</p>` : ''}
            ` : `
                <p><strong>Cửa hàng:</strong> ${order.storeName}</p>
                <p><strong>Địa chỉ:</strong> ${order.storeAddress}</p>
            `}
        </div>
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
            <tbody>${itemsHtml}</tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Tạm tính:</strong></td>
                    <td>${formatCurrency(order.subtotal || 0)}</td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Phí vận chuyển:</strong></td>
                    <td>${order.shipping === 0 ? 'Miễn phí' : formatCurrency(order.shipping || 0)}</td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Giảm giá:</strong></td>
                    <td>-${formatCurrency(order.discount)}</td>
                </tr>
                ` : ''}
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Tổng cộng:</strong></td>
                    <td>${formatCurrency(order.total || 0)}</td>
                </tr>
            </tfoot>
        </table>
        <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethodText(order.paymentMethod)}</p>
        <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
    `;

    modal.style.display = 'flex';
    modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
}

function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const index = orders.findIndex(o => o.id == orderId);
    if (index === -1) return;

    orders[index].status = newStatus;
    orders[index].updatedAt = new Date().toISOString();
    localStorage.setItem('orders', JSON.stringify(orders));

    showToast(`Đã cập nhật trạng thái đơn hàng #${orderId}`, 'success');
    loadOrdersSection();
}

// Hàm phụ trợ
function getPaymentMethodText(method) {
    const map = { 'cod': 'COD', 'bank_transfer': 'Chuyển khoản', 'card': 'Thẻ' };
    return map[method] || method;
}

function getOrderStatusText(status) {
    const map = {
        'pending': 'Chờ xử lý', 'processing': 'Đang xử lý', 'approved': 'Đã duyệt',
        'rejected': 'Từ chối', 'cancelled': 'Đã hủy', 'completed': 'Hoàn thành'
    };
    return map[status] || status;
}

function getOrderStatusClass(status) {
    const map = {
        'pending': 'status-pending', 'processing': 'status-processing', 'approved': 'status-approved',
        'rejected': 'status-rejected', 'cancelled': 'status-cancelled', 'completed': 'status-completed'
    };
    return map[status] || '';
}

function calculateMemberLevel(totalProducts) {
    if (totalProducts >= 50) return { name: 'Kim cương', class: 'kimcuong' };
    if (totalProducts >= 30) return { name: 'Vàng', class: 'vang' };
    if (totalProducts >= 10) return { name: 'Bạc', class: 'bac' };
    return { name: 'Đồng', class: 'dong' };
}

function loadStoreOptions() {
    const stores = JSON.parse(localStorage.getItem('stores')) || [];
    const select = document.getElementById('product-stores');
    if (select) {
        select.innerHTML = stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }
}

// Biến lưu dữ liệu analytics hiện tại
let currentAnalyticsData = null;

// ==================== ANALYTICS FUNCTIONS ====================

// Load dữ liệu analytics
function loadAnalyticsData() {
    const dateRange = document.getElementById('time-filter').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Gọi hàm getAnalyticsData từ analytics.js
    const data = getAnalyticsData(dateRange, startDate, endDate);
    currentAnalyticsData = data;

    // Cập nhật giao diện
    updateAnalyticsUI(data);
}

// Cập nhật toàn bộ giao diện analytics
function updateAnalyticsUI(data) {
    updateKPICards(data.kpi);
    updateCharts(data);
    updateAnalyticsTables(data);
    updateQuickStats(data.quickStats);
    updateTrendIndicators(data);
}

// Cập nhật KPI cards
function updateKPICards(kpi) {
    // Kiểm tra và cập nhật từng phần tử
    const elements = {
        'total-revenue': formatCurrency(kpi.totalRevenue),
        'total-orders': kpi.totalOrders,
        'total-customers': kpi.totalCustomers,
        'new-customers': kpi.newCustomers,
        'returning-customers': kpi.returningCustomers,
        'average-order-value': formatCurrency(kpi.aov),
        'total-products-sold': kpi.totalProductsSold,
        'conversion-rate': kpi.conversionRate + '%'
    };

    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
}

// Cập nhật biểu đồ
function updateCharts(data) {
    if (typeof initCharts === 'function') {
        initCharts({
            revenueByDate: data.revenueByDate,
            ordersByDate: data.ordersByDate,
            revenueByCategory: data.revenueByCategory,
            topProducts: data.topProducts,
            newVsReturning: data.newVsReturning
        });
    }
}

// Cập nhật các bảng dữ liệu
function updateAnalyticsTables(data) {
    // Bảng đơn hàng gần đây
    const recentTbody = document.getElementById('recent-orders-list');
    if (recentTbody) {
        recentTbody.innerHTML = data.recentOrders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${formatCurrency(order.total)}</td>
                <td><span class="status-badge status-${order.status}">${getOrderStatusText(order.status)}</span></td>
                <td>${order.date}</td>
            </tr>
        `).join('');
    }

    // Bảng top khách hàng
    const customersTbody = document.getElementById('top-customers-list');
    if (customersTbody) {
        customersTbody.innerHTML = data.topCustomers.map(c => `
            <tr>
                <td>${c.name}</td>
                <td>${c.orders}</td>
                <td>${formatCurrency(c.spent)}</td>
            </tr>
        `).join('');
    }

    // Bảng top sản phẩm
    const productsTbody = document.getElementById('top-products-list');
    if (productsTbody) {
        productsTbody.innerHTML = data.topProductsList.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${getCategoryName(p.category)}</td>
                <td>${p.quantity}</td>
                <td>${formatCurrency(p.revenue)}</td>
            </tr>
        `).join('');
    }
}

// Cập nhật thống kê nhanh
function updateQuickStats(stats) {
    const elements = {
        'completed-orders': stats.completed,
        'pending-orders': stats.pending,
        'cancelled-orders': stats.cancelled,
        'avg-daily-revenue': formatCurrency(stats.avgDaily),
        'total-stock': stats.totalStock,
        'low-stock-count': stats.lowStock
    };

    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
}

// Cập nhật chỉ số xu hướng (tăng/giảm so với kỳ trước)
function updateTrendIndicators(data) {
    // So sánh với kỳ trước để tính trend
    const previousPeriod = getPreviousPeriodData();

    const trends = {
        'revenue-change': calculateTrend(data.kpi.totalRevenue, previousPeriod.revenue),
        'orders-change': calculateTrend(data.kpi.totalOrders, previousPeriod.orders),
        'customers-change': calculateTrend(data.kpi.totalCustomers, previousPeriod.customers)
    };

    Object.entries(trends).forEach(([id, trend]) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = trend.text;
            el.className = `trend ${trend.class}`;
        }
    });
}

// Tính toán xu hướng
function calculateTrend(current, previous) {
    if (!previous || previous === 0) return { text: '0%', class: '' };
    const percent = ((current - previous) / previous * 100).toFixed(1);
    const text = percent > 0 ? `+${percent}%` : `${percent}%`;
    const className = percent > 0 ? 'up' : (percent < 0 ? 'down' : '');
    return { text, class: className };
}

// Lấy dữ liệu kỳ trước
function getPreviousPeriodData() {
    const dateRange = document.getElementById('time-filter').value;
    // Tính toán dữ liệu kỳ trước dựa trên dateRange
    // Logic này có thể phức tạp, tạm thời trả về 0
    return {
        revenue: 0,
        orders: 0,
        customers: 0
    };
}

// ==================== EXPORT FUNCTIONS ====================

// Xuất dữ liệu ra Excel
function exportToExcel() {
    if (!currentAnalyticsData) {
        showToast('Không có dữ liệu để xuất', 'error');
        return;
    }

    // Tạo nội dung Excel (CSV format)
    let csv = 'BÁO CÁO THỐNG KÊ KPI\n';
    csv += `Ngày xuất: ${new Date().toLocaleString('vi-VN')}\n`;
    csv += `Khoảng thời gian: ${document.getElementById('time-filter').selectedOptions[0].text}\n\n`;

    // KPI Tổng quan
    csv += 'KPI TỔNG QUAN\n';
    csv += `Tổng doanh thu,${formatCurrency(currentAnalyticsData.kpi.totalRevenue)}\n`;
    csv += `Tổng đơn hàng,${currentAnalyticsData.kpi.totalOrders}\n`;
    csv += `Tổng khách hàng,${currentAnalyticsData.kpi.totalCustomers}\n`;
    csv += `Khách hàng mới,${currentAnalyticsData.kpi.newCustomers}\n`;
    csv += `Khách hàng quay lại,${currentAnalyticsData.kpi.returningCustomers}\n`;
    csv += `Giá trị TB đơn hàng,${formatCurrency(currentAnalyticsData.kpi.aov)}\n`;
    csv += `Sản phẩm đã bán,${currentAnalyticsData.kpi.totalProductsSold}\n`;
    csv += `Tỉ lệ chuyển đổi,${currentAnalyticsData.kpi.conversionRate}%\n\n`;

    // Doanh thu theo ngày
    csv += 'DOANH THU THEO NGÀY\n';
    csv += 'Ngày,Doanh thu\n';
    currentAnalyticsData.revenueByDate.labels.forEach((label, index) => {
        csv += `${label},${currentAnalyticsData.revenueByDate.values[index]}\n`;
    });
    csv += '\n';

    // Đơn hàng theo ngày
    csv += 'ĐƠN HÀNG THEO NGÀY\n';
    csv += 'Ngày,Số đơn\n';
    currentAnalyticsData.ordersByDate.labels.forEach((label, index) => {
        csv += `${label},${currentAnalyticsData.ordersByDate.values[index]}\n`;
    });
    csv += '\n';

    // Doanh thu theo danh mục
    csv += 'DOANH THU THEO DANH MỤC\n';
    csv += 'Danh mục,Doanh thu\n';
    currentAnalyticsData.revenueByCategory.labels.forEach((label, index) => {
        csv += `${label},${currentAnalyticsData.revenueByCategory.values[index]}\n`;
    });
    csv += '\n';

    // Đơn hàng gần đây
    csv += 'ĐƠN HÀNG GẦN ĐÂY\n';
    csv += 'Mã ĐH,Khách hàng,Tổng tiền,Trạng thái,Ngày đặt\n';
    currentAnalyticsData.recentOrders.forEach(o => {
        csv += `#${o.id},${o.customerName},${o.total},${o.status},${o.date}\n`;
    });
    csv += '\n';

    // Top khách hàng
    csv += 'TOP KHÁCH HÀNG\n';
    csv += 'Khách hàng,Số đơn hàng,Tổng chi tiêu\n';
    currentAnalyticsData.topCustomers.forEach(c => {
        csv += `${c.name},${c.orders},${c.spent}\n`;
    });
    csv += '\n';

    // Top sản phẩm
    csv += 'TOP SẢN PHẨM BÁN CHẠY\n';
    csv += 'Sản phẩm,Danh mục,Đã bán,Doanh thu\n';
    currentAnalyticsData.topProductsList.forEach(p => {
        csv += `${p.name},${getCategoryName(p.category)},${p.quantity},${p.revenue}\n`;
    });

    // Tạo và tải file
    downloadCSV(csv, `thong-ke-${new Date().toISOString().split('T')[0]}.csv`);
    showToast('Xuất báo cáo thành công!', 'success');
}

// Tải file CSV
function downloadCSV(csv, filename) {
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ==================== DASHBOARD FUNCTIONS ====================

// Cập nhật dashboard tổng quan
function updateDashboard() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Cập nhật stats cards
    document.getElementById('total-products').textContent = products.length;

    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    document.getElementById('today-orders').textContent = todayOrders.length;

    document.getElementById('total-members').textContent = users.filter(u => !u.isAdmin).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = orders
        .filter(o => o.status === 'completed' || o.status === 'approved')
        .filter(o => {
            const d = new Date(o.createdAt);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, o) => sum + (o.total || 0), 0);
    document.getElementById('monthly-revenue').textContent = formatCurrency(monthlyRevenue);

    // Đơn hàng gần đây
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const recentList = document.getElementById('recent-orders-list');
    if (recentList) {
        recentList.innerHTML = recentOrders.length ? recentOrders.map(o => {
            const user = users.find(u => u.id === o.userId);
            return `
                <div class="recent-item">
                    <div class="recent-info">
                        <h4>#${o.id} - ${user?.username || o.customerName || 'Khách'}</h4>
                        <p>${new Date(o.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                    <div class="recent-price">${formatCurrency(o.total || 0)}</div>
                </div>
            `;
        }).join('') : '<p>Chưa có đơn hàng</p>';
    }

    // Sản phẩm sắp hết hàng
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).slice(0, 5);
    const lowStockList = document.getElementById('low-stock-list');
    if (lowStockList) {
        lowStockList.innerHTML = lowStock.length ? lowStock.map(p => `
            <div class="recent-item">
                <div class="recent-info">
                    <h4>${p.name}</h4>
                    <p>Còn ${p.stock} sản phẩm</p>
                </div>
                <div class="recent-price">${formatCurrency(p.price)}</div>
            </div>
        `).join('') : '<p>Không có sản phẩm nào sắp hết hàng</p>';
    }
}

// ==================== INITIALIZATION ====================

// Khởi tạo tất cả
document.addEventListener('DOMContentLoaded', function () {
    // Kiểm tra quyền admin
    if (!isAdmin()) {
        window.location.href = 'index.html';
        return;
    }

    // Hiển thị tên admin
    const user = getCurrentUser();
    document.getElementById('admin-name').textContent = user?.username || 'Admin';

    // Khởi tạo các section
    updateDashboard();
    loadProductsSection();
    loadOrdersSection();
    loadVouchersSection();
    loadMembersSection();
    loadStoresSection();

    // Xử lý chuyển đổi menu
    document.querySelectorAll('.menu-item[data-section]').forEach(item => {
        item.addEventListener('click', function () {
            const section = this.dataset.section;
            switchSection(section);
        });
    });

    // Xử lý đăng xuất từ sidebar
    document.getElementById('admin-logout').addEventListener('click', logout);

    // Xử lý nút làm mới
    document.getElementById('refresh-data').addEventListener('click', function () {
        refreshCurrentSection();
    });

    // Xử lý đăng xuất từ header
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Khởi tạo sự kiện cho analytics
    initAnalyticsEvents();

    // Cập nhật số lượng giỏ hàng
    updateCartCount();
});

// Khởi tạo sự kiện cho analytics
function initAnalyticsEvents() {
    const timeFilter = document.getElementById('time-filter');
    const customRange = document.getElementById('custom-date-range');
    const applyCustom = document.getElementById('apply-custom-range');
    const exportBtn = document.getElementById('export-excel');

    if (timeFilter) {
        timeFilter.addEventListener('change', function () {
            if (this.value === 'custom') {
                customRange.style.display = 'flex';
            } else {
                customRange.style.display = 'none';
                if (typeof loadAnalyticsData === 'function') {
                    loadAnalyticsData();
                }
            }
        });
    }

    if (applyCustom) {
        applyCustom.addEventListener('click', function () {
            if (typeof loadAnalyticsData === 'function') {
                loadAnalyticsData();
            }
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportToExcel);
    }
}

// Cập nhật hàm switchSection để load dữ liệu tương ứng
function switchSection(section) {
    // Cập nhật active menu
    document.querySelectorAll('.menu-item[data-section]').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.menu-item[data-section="${section}"]`).classList.add('active');

    // Cập nhật active section
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');

    // Cập nhật tiêu đề
    const titles = {
        'dashboard': 'Tổng quan',
        'analytics': 'Thống kê KPI',
        'products': 'Quản lý sản phẩm',
        'orders': 'Quản lý đơn hàng',
        'vouchers': 'Quản lý voucher',
        'members': 'Quản lý thành viên',
        'stores': 'Quản lý cửa hàng',
        'settings': 'Cài đặt'
    };
    document.getElementById('page-title').textContent = titles[section] || 'Admin';

    currentAdminSection = section;

    // Load dữ liệu cho section tương ứng
    switch (section) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'analytics':
            if (typeof loadAnalyticsData === 'function') {
                loadAnalyticsData();
            }
            break;
        case 'products':
            loadProductsSection();
            break;
        case 'orders':
            loadOrdersSection();
            break;
        case 'vouchers':
            loadVouchersSection();
            break;
        case 'members':
            loadMembersSection();
            break;
        case 'stores':
            loadStoresSection();
            break;
    }
}

// Cập nhật hàm refreshCurrentSection
function refreshCurrentSection() {
    switch (currentAdminSection) {
        case 'dashboard':
            updateDashboard();
            showToast('Đã làm mới dashboard', 'success');
            break;
        case 'analytics':
            if (typeof loadAnalyticsData === 'function') {
                loadAnalyticsData();
                showToast('Đã làm mới dữ liệu thống kê', 'success');
            }
            break;
        case 'products':
            loadProductsSection();
            showToast('Đã làm mới danh sách sản phẩm', 'success');
            break;
        case 'orders':
            loadOrdersSection();
            showToast('Đã làm mới danh sách đơn hàng', 'success');
            break;
        case 'vouchers':
            loadVouchersSection();
            showToast('Đã làm mới danh sách voucher', 'success');
            break;
        case 'members':
            loadMembersSection();
            showToast('Đã làm mới danh sách thành viên', 'success');
            break;
        case 'stores':
            loadStoresSection();
            showToast('Đã làm mới danh sách cửa hàng', 'success');
            break;
    }
}

// Helper function lấy text trạng thái đơn hàng
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

// Helper function lấy tên danh mục
function getCategoryName(category) {
    const map = {
        'laptop': 'Laptop Gaming',
        'monitor': 'Màn hình Gaming',
        'keyboard': 'Bàn phím Gaming',
        'mouse': 'Chuột Gaming'
    };
    return map[category] || category;
}

// ==================== BỘ LỌC ĐƠN HÀNG ====================
document.addEventListener('click', function (e) {
    const filterBtn = e.target.closest('.filter-btn');
    if (filterBtn) {
        e.preventDefault();

        // 1. Xóa class 'active' của tất cả các nút cũ
        const filterBar = filterBtn.closest('.filter-bar');
        if (filterBar) {
            filterBar.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        }

        // 2. Thêm class 'active' (đổi màu) cho nút vừa click
        filterBtn.classList.add('active');

        // 3. Gọi hàm load lại bảng với dữ liệu mới
        loadOrdersSection(filterBtn.dataset.status);
    }
});

// ==================== XỬ LÝ QUẢN LÝ VOUCHER ====================

// 1. Gắn sự kiện Click cho các nút của Voucher (Dùng Event Delegation)
document.addEventListener('click', function (e) {
    // Nút Thêm voucher mới
    if (e.target.closest('#add-voucher-btn')) {
        e.preventDefault();
        const container = document.getElementById('voucher-form-container');
        if (container) {
            container.style.display = 'block';
            document.getElementById('voucher-form-title').textContent = 'Thêm voucher mới';
            document.getElementById('voucher-form').reset();
            document.getElementById('voucher-id').value = '';
        }
    }

    // Nút Hủy form voucher
    if (e.target.closest('#cancel-voucher-form')) {
        e.preventDefault();
        document.getElementById('voucher-form-container').style.display = 'none';
    }

    // Nút Sửa voucher
    const editVoucherBtn = e.target.closest('.edit-voucher');
    if (editVoucherBtn) {
        e.preventDefault();
        editVoucher(editVoucherBtn.dataset.id);
    }

    // Nút Xóa voucher
    const deleteVoucherBtn = e.target.closest('.delete-voucher');
    if (deleteVoucherBtn) {
        e.preventDefault();
        deleteVoucher(deleteVoucherBtn.dataset.id);
    }
});

// 2. Bắt sự kiện Lưu (Submit) Form Voucher
document.addEventListener('submit', function (e) {
    if (e.target.id === 'voucher-form') {
        e.preventDefault();
        const id = document.getElementById('voucher-id').value;
        const voucherData = {
            code: document.getElementById('voucher-code').value.trim().toUpperCase(),
            type: document.getElementById('voucher-type').value,
            value: parseFloat(document.getElementById('voucher-value').value) || 0,
            minOrder: parseFloat(document.getElementById('voucher-min-order').value) || 0,
            expiry: document.getElementById('voucher-expiry').value,
            active: document.getElementById('voucher-active').value === 'true'
        };

        if (!voucherData.code || !voucherData.value) {
            if (typeof showToast === 'function') showToast('Vui lòng điền đủ thông tin', 'error');
            return;
        }

        let vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];

        if (id) {
            // Sửa voucher
            const index = vouchers.findIndex(v => v.id == id);
            if (index >= 0) {
                vouchers[index] = { ...vouchers[index], ...voucherData };
                if (typeof showToast === 'function') showToast('Cập nhật voucher thành công', 'success');
            }
        } else {
            // Thêm voucher
            if (vouchers.some(v => v.code === voucherData.code)) {
                if (typeof showToast === 'function') showToast('Mã voucher này đã tồn tại!', 'error');
                return;
            }
            const newId = vouchers.length > 0 ? Math.max(...vouchers.map(v => Number(v.id) || 0)) + 1 : 1;
            vouchers.push({ id: newId, ...voucherData });
            if (typeof showToast === 'function') showToast('Thêm voucher thành công', 'success');
        }

        localStorage.setItem('vouchers', JSON.stringify(vouchers));
        document.getElementById('voucher-form-container').style.display = 'none';

        // Cập nhật lại bảng voucher
        loadVouchersSection();
    }
});

// 3. Hàm đưa dữ liệu voucher lên form để Sửa
function editVoucher(id) {
    let vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    const v = vouchers.find(v => v.id == id);
    if (!v) return;

    document.getElementById('voucher-id').value = v.id;
    document.getElementById('voucher-code').value = v.code;
    document.getElementById('voucher-type').value = v.type || 'fixed';
    document.getElementById('voucher-value').value = v.value;
    document.getElementById('voucher-min-order').value = v.minOrder || 0;
    document.getElementById('voucher-expiry').value = v.expiry || '';
    document.getElementById('voucher-active').value = v.active !== false ? 'true' : 'false';

    const titleEl = document.getElementById('voucher-form-title');
    if (titleEl) titleEl.textContent = 'Sửa voucher';

    document.getElementById('voucher-form-container').style.display = 'block';
    window.scrollTo(0, 0); // Cuộn lên đầu trang
}

// 4. Hàm xóa Voucher
function deleteVoucher(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
    let vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    vouchers = vouchers.filter(v => v.id != id);
    localStorage.setItem('vouchers', JSON.stringify(vouchers));

    if (typeof showToast === 'function') showToast('Đã xóa voucher', 'success');

    // Cập nhật lại bảng voucher
    loadVouchersSection();
}

// ==================== XỬ LÝ QUẢN LÝ CỬA HÀNG ====================

// 1. Gắn sự kiện Click cho các nút của Cửa hàng
document.addEventListener('click', function (e) {
    // Nút Thêm cửa hàng mới
    if (e.target.closest('#add-store-btn')) {
        e.preventDefault();
        const container = document.getElementById('store-form-container');
        if (container) {
            container.style.display = 'block';
            const title = document.getElementById('store-form-title');
            if (title) title.textContent = 'Thêm cửa hàng mới';
            document.getElementById('store-form').reset();
            document.getElementById('store-id').value = '';
        }
    }

    // Nút Hủy form cửa hàng
    if (e.target.closest('#cancel-store-form') || e.target.closest('#cancel-store')) {
        e.preventDefault();
        const container = document.getElementById('store-form-container');
        if (container) container.style.display = 'none';
    }

    // Nút Sửa cửa hàng
    const editStoreBtn = e.target.closest('.edit-store');
    if (editStoreBtn) {
        e.preventDefault();
        editStore(editStoreBtn.dataset.id);
    }

    // Nút Xóa cửa hàng
    const deleteStoreBtn = e.target.closest('.delete-store');
    if (deleteStoreBtn) {
        e.preventDefault();
        deleteStore(deleteStoreBtn.dataset.id);
    }
});

// 2. Bắt sự kiện Lưu (Submit) Form Cửa hàng
document.addEventListener('submit', function (e) {
    if (e.target.id === 'store-form') {
        e.preventDefault();
        const id = document.getElementById('store-id').value;
        const storeData = {
            name: document.getElementById('store-name').value.trim(),
            address: document.getElementById('store-address').value.trim(),
            phone: document.getElementById('store-phone').value.trim()
        };

        if (!storeData.name || !storeData.address || !storeData.phone) {
            if (typeof showToast === 'function') showToast('Vui lòng điền đủ thông tin', 'error');
            return;
        }

        let stores = JSON.parse(localStorage.getItem('stores')) || [];

        if (id) {
            // Sửa cửa hàng
            const index = stores.findIndex(s => s.id == id);
            if (index >= 0) {
                stores[index] = { ...stores[index], ...storeData };
                if (typeof showToast === 'function') showToast('Cập nhật cửa hàng thành công', 'success');
            }
        } else {
            // Thêm cửa hàng
            const newId = stores.length > 0 ? Math.max(...stores.map(s => Number(s.id) || 0)) + 1 : 1;
            storeData.products = []; // Cửa hàng mới mặc định chưa có sản phẩm nào
            stores.push({ id: newId, ...storeData });
            if (typeof showToast === 'function') showToast('Thêm cửa hàng thành công', 'success');
        }

        localStorage.setItem('stores', JSON.stringify(stores));
        document.getElementById('store-form-container').style.display = 'none';

        // Cập nhật lại bảng danh sách cửa hàng
        loadStoresSection();
    }
});

// 3. Hàm đưa dữ liệu cửa hàng lên form để Sửa
function editStore(id) {
    let stores = JSON.parse(localStorage.getItem('stores')) || [];
    const s = stores.find(s => s.id == id);
    if (!s) return;

    document.getElementById('store-id').value = s.id;
    document.getElementById('store-name').value = s.name;
    document.getElementById('store-address').value = s.address;
    document.getElementById('store-phone').value = s.phone;

    const titleEl = document.getElementById('store-form-title');
    if (titleEl) titleEl.textContent = 'Sửa cửa hàng';

    document.getElementById('store-form-container').style.display = 'block';
    window.scrollTo(0, 0); // Cuộn lên đầu trang
}

// 4. Hàm xóa Cửa hàng
function deleteStore(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa cửa hàng này?')) return;
    let stores = JSON.parse(localStorage.getItem('stores')) || [];
    stores = stores.filter(s => s.id != id);
    localStorage.setItem('stores', JSON.stringify(stores));

    if (typeof showToast === 'function') showToast('Đã xóa cửa hàng', 'success');

    // Cập nhật lại bảng
    loadStoresSection();
}

// ==================== XỬ LÝ CÀI ĐẶT & HỆ THỐNG ====================

document.addEventListener('DOMContentLoaded', function () {
    // 1. Chức năng Backup Dữ liệu
    const backupBtn = document.getElementById('backup-data-btn');
    if (backupBtn) {
        backupBtn.addEventListener('click', function () {
            // Lấy toàn bộ dữ liệu trong LocalStorage
            const allData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                allData[key] = localStorage.getItem(key);
            }

            // Chuyển thành chuỗi JSON
            const dataStr = JSON.stringify(allData, null, 2);

            // Tạo file và kích hoạt tải xuống
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ROG_TechStore_Backup_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (typeof showToast === 'function') showToast('Đã kết xuất dữ liệu hệ thống!', 'success');
        });
    }

    // 2. Chức năng Xóa sạch dữ liệu (Wipe Data)
    const wipeBtn = document.getElementById('wipe-data-btn');
    if (wipeBtn) {
        wipeBtn.addEventListener('click', function () {
            const confirmWipe = confirm("CẢNH BÁO TỐI THƯỢNG!\n\nBạn có chắc chắn muốn xóa toàn bộ dữ liệu Đơn hàng, Sản phẩm, Users... không?\nHành động này không thể hoàn tác!");

            if (confirmWipe) {
                // Xóa sạch LocalStorage
                localStorage.clear();

                // Nạp lại tài khoản Admin mặc định để không bị khóa tài khoản
                const defaultAdmin = [{
                    id: 1,
                    username: "admin",
                    password: "123", // Mật khẩu gốc của bạn
                    email: "admin@rog.com",
                    isAdmin: true,
                    createdAt: new Date().toISOString()
                }];
                localStorage.setItem('users', JSON.stringify(defaultAdmin));

                alert("ĐÃ HỦY DIỆT DỮ LIỆU. Hệ thống sẽ khởi động lại.");
                // Đăng xuất và tải lại trang
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        });
    }
});