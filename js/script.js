document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    const newYearPopup = document.getElementById('newyear-popup');
    if (newYearPopup && !sessionStorage.getItem('newyear_shown')) {
        newYearPopup.style.display = 'flex';
        const closeBtn = newYearPopup.querySelector('.close-popup');
        closeBtn.addEventListener('click', () => {
            newYearPopup.style.display = 'none';
            sessionStorage.setItem('newyear_shown', 'true');
        });
        setTimeout(() => {
            newYearPopup.style.display = 'none';
            sessionStorage.setItem('newyear_shown', 'true');
        }, 5000);
    }

    initScrollReveal();
    initHeroSlider();
});

function loadFeaturedProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const featured = products.slice(0, 4); // lấy 4 sản phẩm đầu
    const grid = document.getElementById('featured-products');
    if (!grid) return;
    grid.innerHTML = '';
    featured.forEach(prod => {
        const card = createProductCard(prod);
        grid.appendChild(card);
    });
}

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <span class="product-category">${getCategoryName(product.category)}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <div class="product-stock ${product.stock > 0 ? (product.stock < 5 ? 'low-stock' : 'in-stock') : 'out-of-stock'}">
                <i class="fas fa-${product.stock > 0 ? 'check' : 'times'}"></i>
                ${product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </div>
            <div class="product-actions">
                <button class="btn btn-outline view-detail" data-id="${product.id}">Chi tiết</button>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>Thêm vào giỏ</button>
            </div>
        </div>
    `;
    // Thêm sự kiện
    div.querySelector('.view-detail').addEventListener('click', () => {
        window.location.href = `product-detail.html?id=${product.id}`;
    });
    div.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(product.id, 1);
    });
    return div;
}

function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    elements.forEach(el => observer.observe(el));
}

function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots = Array.from(slider.querySelectorAll('.hero-dot'));
    if (!slides.length) return;
    let index = 0;

    function showSlide(i) {
        slides.forEach((s, idx) => {
            s.classList.toggle('active', idx === i);
        });
        dots.forEach((d, idx) => {
            d.classList.toggle('active', idx === i);
        });
        index = i;
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => showSlide(idx));
    });

    setInterval(() => {
        const next = (index + 1) % slides.length;
        showSlide(next);
    }, 5000);
}
