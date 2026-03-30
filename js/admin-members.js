// admin-members.js

function loadMembers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('members-list');
    
    if (!tbody) return;
    tbody.innerHTML = '';

    users.forEach(user => {
        const userOrders = orders.filter(o => o.userId === user.id && o.status !== 'cancelled' && o.status !== 'rejected');
        
        let totalProducts = 0;
        let totalSpent = 0;
        
        userOrders.forEach(order => {
            order.items.forEach(item => {
                totalProducts += item.quantity;
            });
            totalSpent += order.total;
        });

        let tier = 'Đồng';
        let tierColor = '#cd7f32'; // Màu đồng
        if (totalSpent >= 50000000) { tier = 'Kim cương'; tierColor = '#b9f2ff'; }
        else if (totalSpent >= 20000000) { tier = 'Vàng'; tierColor = '#ffd700'; }
        else if (totalSpent >= 5000000) { tier = 'Bạc'; tierColor = '#c0c0c0'; }

        const level = Math.floor(totalProducts / 10) + 1;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td><strong>${user.username}</strong></td>
            <td>${user.email}</td>
            <td><span style="background-color: ${tierColor}; padding: 4px 8px; border-radius: 4px; color: #000; font-weight: bold;">${tier}</span></td>
            <td>${level}</td>
            <td>${totalProducts}</td>
            <td>${typeof formatCurrency === 'function' ? formatCurrency(totalSpent) : totalSpent}</td>
            <td>
                ${user.role === 'admin' ? '<span style="color: gray">Admin</span>' : `<button type="button" class="btn btn-sm btn-danger delete-user" data-id="${user.id}">Xóa</button>`}
            </td>
        `;
        tbody.appendChild(row);
    });

    // Cài đặt sự kiện xóa người dùng
    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const userId = this.dataset.id;
            if (confirm('Bạn có chắc chắn muốn xóa thành viên này? Toàn bộ lịch sử sẽ bị mất.')) {
                let allUsers = JSON.parse(localStorage.getItem('users')) || [];
                allUsers = allUsers.filter(u => u.id != userId);
                localStorage.setItem('users', JSON.stringify(allUsers));
                loadMembers(); // Tải lại bảng sau khi xoá
                if(typeof showToast === 'function') showToast('Đã xóa thành viên', 'success');
            }
        });
    });
}

// GỌI HÀM KHI DOM ĐÃ LOAD XONG
document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
});

// // admin-members.js

// function loadMembers() {
//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     const orders = JSON.parse(localStorage.getItem('orders')) || [];
//     const tbody = document.getElementById('members-list');
//     tbody.innerHTML = '';

//     users.forEach(user => {
//         // Tính toán thông tin từ đơn hàng
//         const userOrders = orders.filter(o => o.userId === user.id && o.status !== 'cancelled' && o.status !== 'rejected');
//         // Tổng số sản phẩm đã mua (từ các đơn hàng, tính tổng quantity)
//         let totalProducts = 0;
//         let totalSpent = 0;
//         userOrders.forEach(order => {
//             order.items.forEach(item => {
//                 totalProducts += item.quantity;
//             });
//             totalSpent += order.total;
//         });

//         // Xác định cấp thành viên dựa trên tổng chi tiêu
//         let tier = 'Đồng';
//         if (totalSpent >= 50000000) tier = 'Kim cương';
//         else if (totalSpent >= 20000000) tier = 'Vàng';
//         else if (totalSpent >= 5000000) tier = 'Bạc';

//         // Level có thể là cấp độ dựa trên số lượng sản phẩm đã mua (ví dụ: mỗi 10 sản phẩm tăng 1 level)
//         const level = Math.floor(totalProducts / 10) + 1;

//         // Ngày tham gia (lấy từ lần đầu tiên user xuất hiện? Không có, có thể lấy từ lúc tạo user? 
//         // Ta có thể lấy ngày tạo user từ localStorage? Không có, nên tạm thời để trống hoặc lấy ngày hiện tại.
//         // Ở đây ta để trống.

//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${user.id}</td>
//             <td>${user.username}</td>
//             <td>${user.email}</td>
//             <td><span class="tier-badge tier-${tier}">${tier}</span></td>
//             <td>${level}</td>
//             <td>${totalProducts}</td>
//             <td>${formatCurrency(totalSpent)}</td>
//             <td>-</td>
//         `;
//         tbody.appendChild(row);
//     });
// }