document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderNewsVouchers();
});

function renderNewsVouchers() {
    const container = document.createElement('section');
    container.className = 'news-vouchers scroll-reveal';
    const inner = document.createElement('div');
    inner.className = 'container';

    const title = document.createElement('h2');
    title.textContent = 'Mã voucher đang áp dụng tại TechStore';

    const desc = document.createElement('p');
    desc.textContent = 'Sử dụng các mã bên dưới tại giỏ hàng để được giảm giá.';

    const list = document.createElement('div');
    list.className = 'voucher-list';

    const vouchers = getVouchers().filter(v => v.active);
    if (!vouchers.length) {
        const empty = document.createElement('p');
        empty.textContent = 'Hiện chưa có voucher nào đang hoạt động.';
        list.appendChild(empty);
    } else {
        vouchers.forEach(v => {
            const card = document.createElement('div');
            card.className = 'voucher-card';
            const header = document.createElement('div');
            header.className = 'voucher-header';

            const code = document.createElement('span');
            code.className = 'voucher-code';
            code.textContent = v.code;

            const type = document.createElement('span');
            type.className = 'voucher-type';
            type.textContent = v.type === 'percent' ? v.value + '% giảm' : formatCurrency(v.value) + ' giảm';

            header.appendChild(code);
            header.appendChild(type);

            const body = document.createElement('div');
            body.className = 'voucher-body';

            const min = document.createElement('p');
            min.textContent = v.minOrder ? 'Đơn tối thiểu ' + formatCurrency(v.minOrder) : 'Không giới hạn đơn tối thiểu';

            const expiry = document.createElement('p');
            expiry.textContent = v.expiry ? 'Hạn dùng: ' + v.expiry : 'Không giới hạn thời gian';

            body.appendChild(min);
            body.appendChild(expiry);

            card.appendChild(header);
            card.appendChild(body);
            list.appendChild(card);
        });
    }

    inner.appendChild(title);
    inner.appendChild(desc);
    inner.appendChild(list);
    container.appendChild(inner);

    const main = document.querySelector('main.container');
    if (main) {
        main.appendChild(container);
    }
}

