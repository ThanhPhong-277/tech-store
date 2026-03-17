// data.js

// Dữ liệu sản phẩm mẫu
const sampleProducts = [
    {
        id: 1,
        name: 'Laptop ASUS ROG Strix G15',
        category: 'laptop',
        price: 25990000,
        stock: 10,
        image: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/a/laptop-asus-gaming-rog-strix-g51_8__3.jpg',
        description: 'Laptop gaming mạnh mẽ với AMD Ryzen 7, RTX 3060, 16GB RAM, 512GB SSD.',
        colors: ['Đen', 'Xám']
    },
    {
        id: 2,
        name: 'Màn hình ASUS ROG Swift PG279Q',
        category: 'monitor',
        price: 15990000,
        stock: 5,
        image: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/a/laptop-asus-gaming-rog-strix-g51_8__3.jpg',
        description: 'Màn hình 27 inch 2K 165Hz, IPS, G-Sync.',
        colors: ['Đen']
    },
    // Thêm các sản phẩm khác...
];

// Dữ liệu voucher mẫu
const sampleVouchers = [
    { id: 1, code: 'WELCOME10', discount: 10, type: 'percent', minOrder: 0, expiry: '2025-12-31', active: true },
    { id: 2, code: 'SALE50K', discount: 50000, type: 'fixed', minOrder: 500000, expiry: '2025-06-30', active: true },
];

// Dữ liệu người dùng mẫu
const sampleUsers = [
    { id: 1, username: 'admin', email: 'admin@techstore.com', password: 'admin123', isAdmin: true },
    { id: 2, username: 'user1', email: 'user1@example.com', password: 'user123', isAdmin: false }
];

// Dữ liệu tỉnh/thành phố (sẽ load từ provinces.js)
let provinces = [];

// Hàm khởi tạo dữ liệu trong localStorage
function initializeData() {
    // Sản phẩm
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        console.log('Đã khởi tạo sản phẩm mẫu');
    }
    // Voucher
    if (!localStorage.getItem('vouchers')) {
        localStorage.setItem('vouchers', JSON.stringify(sampleVouchers));
    }
    // Người dùng
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
    // Giỏ hàng
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    // Đơn hàng
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    // Voucher đã lấy của user (userVouchers)
    if (!localStorage.getItem('userVouchers')) {
        localStorage.setItem('userVouchers', JSON.stringify({}));
    }
    // Địa chỉ đã lưu của user
    if (!localStorage.getItem('userAddresses')) {
        localStorage.setItem('userAddresses', JSON.stringify({}));
    }
    // Cửa hàng
    if (!localStorage.getItem('stores')) {
        localStorage.setItem('stores', JSON.stringify(sampleStores));
    }
}

// Gọi khi trang load
initializeData();
{
    initStores(); // từ stores.js
}
if (!localStorage.getItem('stores')) {
    localStorage.setItem('stores', JSON.stringify(sampleStores));
}

// Thêm vào cuối file data.js

// Tạo dữ liệu mẫu cho analytics nếu chưa có
function generateSampleAnalyticsData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Nếu chưa có đơn hàng, tạo dữ liệu mẫu
    if (orders.length === 0) {
        const sampleOrders = [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const products = JSON.parse(localStorage.getItem('products')) || [];
        
        // Tạo đơn hàng cho 30 ngày gần đây
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Tạo 1-5 đơn hàng mỗi ngày
            const ordersCount = Math.floor(Math.random() * 5) + 1;
            
            for (let j = 0; j < ordersCount; j++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const orderProducts = [];
                let total = 0;
                
                // Mỗi đơn có 1-3 sản phẩm
                const productCount = Math.floor(Math.random() * 3) + 1;
                for (let k = 0; k < productCount; k++) {
                    const product = products[Math.floor(Math.random() * products.length)];
                    if (product) {
                        const quantity = Math.floor(Math.random() * 2) + 1;
                        orderProducts.push({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: quantity,
                            color: product.colors ? product.colors[0] : null
                        });
                        total += product.price * quantity;
                    }
                }
                
                const statuses = ['pending', 'processing', 'approved', 'completed', 'cancelled'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                
                sampleOrders.push({
                    id: 1000 + sampleOrders.length + 1,
                    userId: user?.id || 1,
                    customerName: user?.username || 'Khách',
                    customerEmail: user?.email || 'khach@example.com',
                    customerPhone: '0912345678',
                    deliveryType: Math.random() > 0.5 ? 'shipping' : 'store',
                    address: '123 Đường ABC, Quận 1, TP.HCM',
                    items: orderProducts,
                    subtotal: total,
                    shipping: total >= 5000000 ? 0 : 50000,
                    discount: 0,
                    total: total + (total >= 5000000 ? 0 : 50000),
                    paymentMethod: ['cod', 'bank_transfer', 'card'][Math.floor(Math.random() * 3)],
                    status: status,
                    createdAt: date.toISOString(),
                    updatedAt: date.toISOString()
                });
            }
        }
        
        localStorage.setItem('orders', JSON.stringify(sampleOrders));
        console.log('Đã tạo dữ liệu mẫu cho analytics');
    }
}

// Gọi hàm tạo dữ liệu mẫu
generateSampleAnalyticsData();