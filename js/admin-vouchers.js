// admin-vouchers.js

function loadAdminVouchers() {
    const vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    const tbody = document.getElementById('vouchers-list');
    tbody.innerHTML = '';
    vouchers.forEach(v => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${v.id}</td>
            <td>${v.code}</td>
            <td>${v.type === 'percent' ? '%' : 'VNĐ'}</td>
            <td>${v.type === 'percent' ? v.value + '%' : formatCurrency(v.value)}</td>
            <td>${formatCurrency(v.minOrder)}</td>
            <td>${v.expiry}</td>
            <td>${v.active ? 'Hoạt động' : 'Vô hiệu'}</td>
            <td>
                <button class="btn btn-sm btn-outline edit-voucher" data-id="${v.id}">Sửa</button>
                <button class="btn btn-sm btn-danger delete-voucher" data-id="${v.id}">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.edit-voucher').forEach(btn => {
        btn.addEventListener('click', () => editVoucher(btn.dataset.id));
    });
    document.querySelectorAll('.delete-voucher').forEach(btn => {
        btn.addEventListener('click', () => deleteVoucher(btn.dataset.id));
    });
}

document.getElementById('add-voucher-btn')?.addEventListener('click', () => {
    document.getElementById('voucher-form-container').style.display = 'block';
    document.getElementById('voucher-form-title').textContent = 'Thêm voucher mới';
    document.getElementById('voucher-form').reset();
    document.getElementById('voucher-id').value = '';
});

document.getElementById('cancel-voucher')?.addEventListener('click', () => {
    document.getElementById('voucher-form-container').style.display = 'none';
});

document.getElementById('voucher-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('voucher-id').value;
    const voucherData = {
        code: document.getElementById('voucher-code').value.trim(),
        type: document.getElementById('voucher-type').value,
        value: parseFloat(document.getElementById('voucher-value').value),
        minOrder: parseFloat(document.getElementById('voucher-min-order').value) || 0,
        expiry: document.getElementById('voucher-expiry').value,
        active: document.getElementById('voucher-active').value === 'true'
    };

    if (!voucherData.code || !voucherData.value || !voucherData.expiry) {
        showToast('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }

    let vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    if (id) {
        const index = vouchers.findIndex(v => v.id == id);
        if (index >= 0) {
            vouchers[index] = { ...vouchers[index], ...voucherData };
            showToast('Cập nhật voucher thành công', 'success');
        }
    } else {
        const newId = vouchers.length > 0 ? Math.max(...vouchers.map(v => v.id)) + 1 : 1;
        vouchers.push({ id: newId, ...voucherData });
        showToast('Thêm voucher thành công', 'success');
    }
    localStorage.setItem('vouchers', JSON.stringify(vouchers));
    document.getElementById('voucher-form-container').style.display = 'none';
    loadAdminVouchers();
});

function editVoucher(id) {
    const vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    const v = vouchers.find(v => v.id == id);
    if (!v) return;
    document.getElementById('voucher-id').value = v.id;
    document.getElementById('voucher-code').value = v.code;
    document.getElementById('voucher-type').value = v.type;
    document.getElementById('voucher-value').value = v.value;
    document.getElementById('voucher-min-order').value = v.minOrder;
    document.getElementById('voucher-expiry').value = v.expiry;
    document.getElementById('voucher-active').value = v.active ? 'true' : 'false';
    document.getElementById('voucher-form-title').textContent = 'Sửa voucher';
    document.getElementById('voucher-form-container').style.display = 'block';
}

function deleteVoucher(id) {
    if (!confirm('Xóa voucher này?')) return;
    let vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    vouchers = vouchers.filter(v => v.id != id);
    localStorage.setItem('vouchers', JSON.stringify(vouchers));
    loadAdminVouchers();
    showToast('Đã xóa voucher', 'success');
}