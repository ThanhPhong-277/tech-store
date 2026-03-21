function normalizeText(input) {
    return String(input || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

function getProductsList() {
    try {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        return Array.isArray(products) ? products : [];
    } catch (e) {
        return [];
    }
}

function createSuggestionItem(product) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'search-suggest-item';
    item.dataset.id = String(product.id);
    item.innerHTML = `
        <div class="search-suggest-left">
            <img class="search-suggest-thumb" src="${product.image}" alt="${product.name}">
        </div>
        <div class="search-suggest-right">
            <div class="search-suggest-name">${product.name}</div>
            <div class="search-suggest-sub">${getCategoryName(product.category)} • ${formatCurrency(product.price)}</div>
        </div>
    `;
    return item;
}

function setupHeaderSearch() {
    const wrapper = document.querySelector('[data-site-search]');
    if (!wrapper) return;
    const input = wrapper.querySelector('input');
    const list = wrapper.querySelector('.search-suggest');
    const mode = wrapper.dataset.searchMode || 'redirect';
    if (!input || !list) return;

    const products = getProductsList();
    let open = false;

    const closeList = () => {
        open = false;
        list.style.display = 'none';
        list.innerHTML = '';
    };

    const openList = () => {
        open = true;
        list.style.display = 'block';
    };

    const renderList = (query) => {
        const q = normalizeText(query);
        if (!q) {
            closeList();
            return;
        }
        const matches = products
            .filter(p => normalizeText(p.name).includes(q))
            .slice(0, 6);

        if (!matches.length) {
            list.innerHTML = `<div class="search-suggest-empty">Không có gợi ý</div>`;
            openList();
            return;
        }

        list.innerHTML = '';
        matches.forEach(p => list.appendChild(createSuggestionItem(p)));
        openList();
    };

    const applySearch = (q) => {
        const query = String(q || '').trim();
        if (!query) return;
        if (mode === 'filter') {
            if (typeof window.applyProductsSearch === 'function') {
                window.applyProductsSearch(query);
            } else if (typeof window.renderProducts === 'function') {
                const qn = normalizeText(query);
                const filtered = products.filter(p => normalizeText(p.name).includes(qn));
                window.renderProducts(filtered);
            }
        } else {
            window.location.href = `products.html?q=${encodeURIComponent(query)}`;
        }
    };

    input.addEventListener('input', () => renderList(input.value));
    input.addEventListener('focus', () => renderList(input.value));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeList();
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            closeList();
            applySearch(input.value);
        }
    });

    document.addEventListener('click', (e) => {
        if (!open) return;
        if (!wrapper.contains(e.target)) closeList();
    });

    list.addEventListener('click', (e) => {
        const item = e.target.closest('.search-suggest-item');
        if (!item) return;
        const id = item.dataset.id;
        closeList();
        window.location.href = `product-detail.html?id=${encodeURIComponent(id)}`;
    });

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (mode === 'filter' && q) {
        input.value = q;
        applySearch(q);
    }
}

document.addEventListener('DOMContentLoaded', setupHeaderSearch);

