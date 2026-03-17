// admin-members.js

function loadMembers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('members-list');
    tbody.innerHTML = '';

    users.forEach(user => {
        // Tính toán thông tin từ đơn hàng
        const userOrders = orders.filter(o => o.userId === user.id && o.status !== 'cancelled' && o.status !== 'rejected');
        // Tổng số sản phẩm đã mua (từ các đơn hàng, tính tổng quantity)
        let totalProducts = 0;
        let totalSpent = 0;
        userOrders.forEach(order => {
            order.items.forEach(item => {
                totalProducts += item.quantity;
            });
            totalSpent += order.total;
        });

        // Xác định cấp thành viên dựa trên tổng chi tiêu
        let tier = 'Đồng';
        if (totalSpent >= 50000000) tier = 'Kim cương';
        else if (totalSpent >= 20000000) tier = 'Vàng';
        else if (totalSpent >= 5000000) tier = 'Bạc';

        // Level có thể là cấp độ dựa trên số lượng sản phẩm đã mua (ví dụ: mỗi 10 sản phẩm tăng 1 level)
        const level = Math.floor(totalProducts / 10) + 1;

        // Ngày tham gia (lấy từ lần đầu tiên user xuất hiện? Không có, có thể lấy từ lúc tạo user? 
        // Ta có thể lấy ngày tạo user từ localStorage? Không có, nên tạm thời để trống hoặc lấy ngày hiện tại.
        // Ở đây ta để trống.

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="tier-badge tier-${tier}">${tier}</span></td>
            <td>${level}</td>
            <td>${totalProducts}</td>
            <td>${formatCurrency(totalSpent)}</td>
            <td>-</td>
        `;
        tbody.appendChild(row);
    });
}