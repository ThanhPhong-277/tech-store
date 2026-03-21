// js/admin.js

let currentAdminSection = 'dashboard';

document.addEventListener('DOMContentLoaded', function() {
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
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            switchSection(section);
        });
    });

    // Xử lý đăng xuất
    document.getElementById('admin-logout').addEventListener('click', logout);

    // Xử lý nút làm mới
    document.getElementById('refresh-data').addEventListener('click', function() {
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
    switch(currentAdminSection) {
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
    const recentOrders = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
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

// Load đơn hàng
function loadOrdersSection() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Không có đơn hàng</td></tr>';
        return;
    }

    const sorted = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    tbody.innerHTML = sorted.map(order => {
        const statusClass = getOrderStatusClass(order.status);
        const statusText = getOrderStatusText(order.status);
        
        return `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName || 'Khách'}</td>
                <td>${new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                <td>${formatCurrency(order.total || 0)}</td>
                <td><span class="order-status ${statusClass}">${statusText}</span></td>
                <td>${order.deliveryType === 'shipping' ? 'Giao hàng' : 'Tại cửa hàng'}</td>
                <td>${getPaymentMethodText(order.paymentMethod)}</td>
                <td>
                    <button class="btn btn-sm btn-outline view-order" data-id="${order.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <select class="status-select" data-id="${order.id}" style="margin-top: 0.5rem;">
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

    // Gắn sự kiện
    document.querySelectorAll('.view-order').forEach(btn => {
        btn.addEventListener('click', () => viewOrderDetail(btn.dataset.id));
    });
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
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

function seedNewsPostsIfNeeded() {
    const existing = getNewsPosts();
    if (existing.length) return;
    const now = new Date();
    const sample = [
        {
            id: 1,
            title: 'ROG Strix Scar 18 (2024) chính thức lên kệ',
            image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200',
            content: 'ROG Strix Scar 18 (2024) đã có mặt tại ROG TechStore với màn hình Nebula HDR, hiệu năng đỉnh cao và hệ thống tản nhiệt tối ưu cho gaming.\n\nTrải nghiệm trực tiếp tại cửa hàng và nhận ưu đãi dành riêng cho thành viên ROG.',
            createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
            updatedAt: new Date(now.getTime() - 3 * 86400000).toISOString()
        },
        {
            id: 2,
            title: 'Khai trương chi nhánh ROG Elite Store',
            image: 'https://images.pexels.com/photos/19012039/pexels-photo-19012039.jpeg?auto=compress&cs=tinysrgb&w=1200',
            content: 'Chào mừng chi nhánh mới với khu vực trải nghiệm gaming, setup battle-station và hàng loạt phụ kiện ROG.\n\nĐến ngay để nhận voucher khai trương và quà tặng giới hạn.',
            createdAt: new Date(now.getTime() - 6 * 86400000).toISOString(),
            updatedAt: new Date(now.getTime() - 6 * 86400000).toISOString()
        },
        {
            id: 3,
            title: 'ROG Elite Rewards: Tích điểm đổi quà cực chất',
            image: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1200',
            content: 'Tích lũy ROG Points từ mỗi đơn hàng để đổi quà, voucher và phụ kiện giới hạn.\n\nBạn có thể theo dõi điểm và ưu đãi ngay trong trang tin tức.',
            createdAt: new Date(now.getTime() - 9 * 86400000).toISOString(),
            updatedAt: new Date(now.getTime() - 9 * 86400000).toISOString()
        }
    ];
    saveNewsPosts(sample);
}

function openNewsForm(post) {
    const container = document.getElementById('news-form-container');
    const titleEl = document.getElementById('news-form-title');
    const form = document.getElementById('news-form');
    if (!container || !titleEl || !form) return;

    document.getElementById('news-id').value = post ? String(post.id) : '';
    document.getElementById('news-title').value = post ? (post.title || '') : '';
    document.getElementById('news-image').value = post ? (post.image || '') : '';
    document.getElementById('news-content').value = post ? (post.content || '') : '';

    titleEl.textContent = post ? 'Sửa bài viết' : 'Thêm bài viết mới';
    container.style.display = 'block';
}

function closeNewsForm() {
    const container = document.getElementById('news-form-container');
    if (container) container.style.display = 'none';
}

function loadNewsSection() {
    seedNewsPostsIfNeeded();
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

document.getElementById('news-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const idRaw = document.getElementById('news-id')?.value || '';
    const title = (document.getElementById('news-title')?.value || '').trim();
    const image = (document.getElementById('news-image')?.value || '').trim();
    const content = (document.getElementById('news-content')?.value || '').trim();
    if (!title || !image || !content) {
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

document.getElementById('product-form').addEventListener('submit', function(e) {
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
    const recentOrders = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
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
document.addEventListener('DOMContentLoaded', function() {
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
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            switchSection(section);
        });
    });

    // Xử lý đăng xuất từ sidebar
    document.getElementById('admin-logout').addEventListener('click', logout);

    // Xử lý nút làm mới
    document.getElementById('refresh-data').addEventListener('click', function() {
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
        timeFilter.addEventListener('change', function() {
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
        applyCustom.addEventListener('click', function() {
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
    switch(section) {
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
    switch(currentAdminSection) {
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
