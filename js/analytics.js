// js/analytics.js

// Lấy dữ liệu từ localStorage
function getAnalyticsData(dateRange = 'week', startDate = null, endDate = null) {
    console.log('getAnalyticsData called with:', { dateRange, startDate, endDate });
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderItems = getAllOrderItems(orders);

    console.log('Data loaded:', { usersCount: users.length, productsCount: products.length, ordersCount: orders.length });

    // Lọc theo thời gian
    const filteredOrders = filterOrdersByDate(orders, dateRange, startDate, endDate);
    const filteredOrderItems = filterOrderItemsByDate(orderItems, filteredOrders);

    console.log('Filtered data:', { filteredOrders: filteredOrders.length, filteredOrderItems: filteredOrderItems.length });

    // Tính toán KPI
    const kpi = calculateKPI(users, filteredOrders, filteredOrderItems, orders);

    // Dữ liệu biểu đồ
    const revenueByDate = getRevenueByDate(filteredOrders);
    const ordersByDate = getOrdersByDate(filteredOrders);
    const revenueByCategory = getRevenueByCategory(filteredOrderItems, products);
    const topProducts = getTopProducts(filteredOrderItems, products);
    const newVsReturning = getNewVsReturning(users, filteredOrders, orders);

    // Bảng dữ liệu
    const recentOrders = getRecentOrders(filteredOrders, users);
    const topCustomers = getTopCustomers(orders, users);
    const topProductsList = getTopProductsList(filteredOrderItems, products);

    // Thống kê nhanh
    const quickStats = getQuickStats(orders, products);

    const result = {
        kpi,
        revenueByDate,
        ordersByDate,
        revenueByCategory,
        topProducts,
        newVsReturning,
        recentOrders,
        topCustomers,
        topProductsList,
        quickStats
    };

    console.log('Analytics result:', result);
    return result;
}

// Lấy tất cả order items
function getAllOrderItems(orders) {
    const items = [];
    orders.forEach(order => {
        if (order.items && order.items.length) {
            order.items.forEach(item => {
                items.push({
                    ...item,
                    orderId: order.id,
                    orderDate: order.createdAt,
                    orderStatus: order.status
                });
            });
        }
    });
    return items;
}

// Lọc đơn hàng theo ngày
function filterOrdersByDate(orders, dateRange, startDate, endDate) {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch(dateRange) {
        case 'today':
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            break;
        case 'yesterday':
            start.setDate(start.getDate() - 1);
            start.setHours(0,0,0,0);
            end.setDate(end.getDate() - 1);
            end.setHours(23,59,59,999);
            break;
        case 'week':
            start.setDate(start.getDate() - 7);
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            break;
        case 'month':
            start.setMonth(start.getMonth() - 1);
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            break;
        case 'month-current':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        case 'month-last':
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            break;
        case 'year':
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
        case 'custom':
            if (startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
                end.setHours(23,59,59,999);
            }
            break;
        default:
            return orders;
    }

    return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
    });
}

// Lọc order items theo đơn hàng đã lọc
function filterOrderItemsByDate(orderItems, filteredOrders) {
    const orderIds = filteredOrders.map(o => o.id);
    return orderItems.filter(item => orderIds.includes(item.orderId));
}

// Tính KPI
function calculateKPI(users, filteredOrders, filteredOrderItems, allOrders) {
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const totalCustomers = users.filter(u => !u.isAdmin).length;
    
    // Khách hàng mới trong kỳ
    let startDate = new Date();
    if (filteredOrders.length > 0) {
        startDate = new Date(Math.min(...filteredOrders.map(o => new Date(o.createdAt))));
    }
    
    const newCustomers = users.filter(u => {
        if (u.isAdmin) return false;
        const created = new Date(u.createdAt || u.registeredAt || Date.now());
        return created >= startDate;
    }).length;

    // Khách hàng quay lại (mua > 3 đơn)
    const customerOrderCount = {};
    allOrders.forEach(order => {
        if (order.userId) {
            customerOrderCount[order.userId] = (customerOrderCount[order.userId] || 0) + 1;
        }
    });
    const returningCustomers = Object.values(customerOrderCount).filter(count => count > 3).length;

    // AOV
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Tổng sản phẩm đã bán
    const totalProductsSold = filteredOrderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    // Tỉ lệ chuyển đổi (giả sử có 1000 lượt truy cập/ngày)
    const estimatedVisitors = 1000;
    const conversionRate = totalOrders > 0 ? (totalOrders / estimatedVisitors) * 100 : 0;

    return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        newCustomers,
        returningCustomers,
        aov,
        totalProductsSold,
        conversionRate: conversionRate.toFixed(1)
    };
}

// Lấy doanh thu theo ngày
function getRevenueByDate(orders) {
    const revenueMap = new Map();
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    sortedOrders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString('vi-VN');
        revenueMap.set(date, (revenueMap.get(date) || 0) + (order.total || 0));
    });

    return {
        labels: Array.from(revenueMap.keys()),
        values: Array.from(revenueMap.values())
    };
}

// Lấy số đơn hàng theo ngày
function getOrdersByDate(orders) {
    const ordersMap = new Map();
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    sortedOrders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString('vi-VN');
        ordersMap.set(date, (ordersMap.get(date) || 0) + 1);
    });

    return {
        labels: Array.from(ordersMap.keys()),
        values: Array.from(ordersMap.values())
    };
}

// Lấy doanh thu theo danh mục
function getRevenueByCategory(orderItems, products) {
    const categoryMap = new Map();
    const categoryNames = {
        'laptop': 'Laptop',
        'monitor': 'Màn hình',
        'keyboard': 'Bàn phím',
        'mouse': 'Chuột'
    };

    orderItems.forEach(item => {
        const product = products.find(p => p.id === item.productId || p.id === item.id);
        if (product) {
            const category = categoryNames[product.category] || product.category;
            const revenue = (item.price || 0) * (item.quantity || 0);
            categoryMap.set(category, (categoryMap.get(category) || 0) + revenue);
        }
    });

    return {
        labels: Array.from(categoryMap.keys()),
        values: Array.from(categoryMap.values())
    };
}

// Lấy top sản phẩm bán chạy
function getTopProducts(orderItems, products, limit = 5) {
    const productMap = new Map();

    orderItems.forEach(item => {
        const product = products.find(p => p.id === item.productId || p.id === item.id);
        if (product) {
            const name = product.name;
            productMap.set(name, (productMap.get(name) || 0) + (item.quantity || 0));
        }
    });

    const sorted = Array.from(productMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);

    return {
        labels: sorted.map(s => s[0]),
        values: sorted.map(s => s[1])
    };
}

// Lấy tỉ lệ khách mới vs quay lại
function getNewVsReturning(users, filteredOrders, allOrders) {
    const customerOrderCount = {};
    allOrders.forEach(order => {
        if (order.userId) {
            customerOrderCount[order.userId] = (customerOrderCount[order.userId] || 0) + 1;
        }
    });

    // Khách mua trong kỳ lọc
    const customersInPeriod = new Set(filteredOrders.map(o => o.userId).filter(id => id));
    
    let newCount = 0;
    let returningCount = 0;

    customersInPeriod.forEach(userId => {
        if (customerOrderCount[userId] > 3) {
            returningCount++;
        } else {
            newCount++;
        }
    });

    // Nếu không có dữ liệu, trả về giá trị mẫu để hiển thị
    if (customersInPeriod.size === 0) {
        return { new: 1, returning: 1 };
    }

    return { new: newCount, returning: returningCount };
}

// Lấy đơn hàng gần đây
function getRecentOrders(orders, users, limit = 5) {
    const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
    
    return sorted.map(order => {
        const user = users.find(u => u.id === order.userId);
        return {
            id: order.id,
            customerName: user?.username || order.customerName || 'Khách',
            total: order.total || 0,
            status: order.status || 'pending',
            date: new Date(order.createdAt).toLocaleString('vi-VN')
        };
    });
}

// Lấy top khách hàng
function getTopCustomers(orders, users, limit = 5) {
    const customerStats = {};

    orders.forEach(order => {
        if (order.userId) {
            if (!customerStats[order.userId]) {
                customerStats[order.userId] = {
                    orders: 0,
                    spent: 0
                };
            }
            customerStats[order.userId].orders++;
            customerStats[order.userId].spent += order.total || 0;
        }
    });

    const sorted = Object.entries(customerStats)
        .map(([userId, stats]) => ({
            userId: parseInt(userId),
            ...stats
        }))
        .sort((a, b) => b.spent - a.spent)
        .slice(0, limit);

    return sorted.map(stat => {
        const user = users.find(u => u.id === stat.userId);
        return {
            name: user?.username || 'Khách',
            orders: stat.orders,
            spent: stat.spent
        };
    });
}

// Lấy top sản phẩm (dạng bảng)
function getTopProductsList(orderItems, products, limit = 5) {
    const productStats = {};

    orderItems.forEach(item => {
        const product = products.find(p => p.id === item.productId || p.id === item.id);
        if (product) {
            if (!productStats[product.id]) {
                productStats[product.id] = {
                    name: product.name,
                    category: product.category,
                    quantity: 0,
                    revenue: 0
                };
            }
            productStats[product.id].quantity += item.quantity || 0;
            productStats[product.id].revenue += (item.price || 0) * (item.quantity || 0);
        }
    });

    return Object.values(productStats)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, limit);
}

// Thống kê nhanh
function getQuickStats(orders, products) {
    const completed = orders.filter(o => o.status === 'completed' || o.status === 'approved').length;
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const cancelled = orders.filter(o => o.status === 'cancelled' || o.status === 'rejected').length;
    
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).length;

    // Doanh thu trung bình/ngày (30 ngày gần nhất)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = orders.filter(o => new Date(o.createdAt) >= thirtyDaysAgo);
    const recentRevenue = recentOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgDaily = recentRevenue / 30;

    return {
        completed,
        pending,
        cancelled,
        totalStock,
        lowStock,
        avgDaily
    };
}