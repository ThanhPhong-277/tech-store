// stores.js
const sampleStores = [
    { id: 1, name: 'TechStore Hà Nội', address: '123 Trần Duy Hưng, Cầu Giấy, Hà Nội', phone: '024 12345678', products: [1,2,3,4,5] },
    { id: 2, name: 'TechStore HCM', address: '456 Nguyễn Văn Linh, Quận 7, TP.HCM', phone: '028 87654321', products: [1,2,6,7,8] },
    { id: 3, name: 'TechStore Đà Nẵng', address: '789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', phone: '0236 5558888', products: [3,4,5,9,10] }
];

// Khởi tạo trong localStorage
function initStores() {
    if (!localStorage.getItem('stores')) {
        localStorage.setItem('stores', JSON.stringify(sampleStores));
    }
}

// Lấy danh sách cửa hàng
function getStores() {
    return JSON.parse(localStorage.getItem('stores')) || [];
}

// Lấy cửa hàng có chứa sản phẩm (cho cart)
function getStoresByProductIds(productIds) {
    const stores = getStores();
    return stores.filter(store => store.products.some(pid => productIds.includes(pid)));
}