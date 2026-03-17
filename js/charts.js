// js/charts.js

let revenueChart, ordersChart, categoryChart, topProductsChart, customerChart;

// Khởi tạo tất cả biểu đồ
function initCharts(data) {
    destroyCharts();
    initRevenueChart(data.revenueByDate);
    initOrdersChart(data.ordersByDate);
    initCategoryChart(data.revenueByCategory);
    initTopProductsChart(data.topProducts);
    initCustomerChart(data.newVsReturning);
}

// Hủy biểu đồ cũ
function destroyCharts() {
    if (revenueChart) revenueChart.destroy();
    if (ordersChart) ordersChart.destroy();
    if (categoryChart) categoryChart.destroy();
    if (topProductsChart) topProductsChart.destroy();
    if (customerChart) customerChart.destroy();
}

// Biểu đồ doanh thu
function initRevenueChart(data) {
    const ctx = document.getElementById('revenue-chart').getContext('2d');
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Doanh thu',
                data: data.values,
                borderColor: '#34a853',
                backgroundColor: 'rgba(52, 168, 83, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { 
                    callbacks: {
                        label: (context) => `Doanh thu: ${formatCurrency(context.raw)}`
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: (value) => formatCurrency(value)
                    }
                }
            }
        }
    });
}

// Biểu đồ đơn hàng
function initOrdersChart(data) {
    const ctx = document.getElementById('orders-chart').getContext('2d');
    ordersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Số đơn hàng',
                data: data.values,
                backgroundColor: '#4285f4',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Biểu đồ doanh thu theo danh mục
function initCategoryChart(data) {
    const ctx = document.getElementById('category-chart').getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: ['#4285f4', '#ea4335', '#fbbc05', '#34a853', '#7986cb'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Biểu đồ top sản phẩm
function initTopProductsChart(data) {
    const ctx = document.getElementById('top-products-chart').getContext('2d');
    topProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Số lượng bán',
                data: data.values,
                backgroundColor: '#fbbc05',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Biểu đồ khách hàng mới vs quay lại
function initCustomerChart(data) {
    const ctx = document.getElementById('customer-chart').getContext('2d');
    customerChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Khách hàng mới', 'Khách hàng quay lại'],
            datasets: [{
                data: [data.new, data.returning],
                backgroundColor: ['#34a853', '#4285f4'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}