// provinces.js - Dữ liệu mẫu mở rộng
const provincesData = [
    {
        id: 1,
        name: "Hà Nội",
        districts: [
            { id: 101, name: "Ba Đình", wards: [ { id: 1001, name: "Phúc Xá" }, { id: 1002, name: "Trúc Bạch" }, { id: 1003, name: "Vĩnh Phúc" } ] },
            { id: 102, name: "Hoàn Kiếm", wards: [ { id: 1101, name: "Hàng Bạc" }, { id: 1102, name: "Hàng Đào" }, { id: 1103, name: "Hàng Buồm" } ] },
            { id: 103, name: "Hai Bà Trưng", wards: [ { id: 1201, name: "Bách Khoa" }, { id: 1202, name: "Bạch Mai" }, { id: 1203, name: "Cầu Dền" } ] }
        ]
    },
    {
        id: 2,
        name: "TP. Hồ Chí Minh",
        districts: [
            { id: 201, name: "Quận 1", wards: [ { id: 2001, name: "Bến Nghé" }, { id: 2002, name: "Bến Thành" }, { id: 2003, name: "Cô Giang" } ] },
            { id: 202, name: "Quận 2", wards: [ { id: 2101, name: "An Khánh" }, { id: 2102, name: "An Lợi Đông" }, { id: 2103, name: "Bình An" } ] },
            { id: 203, name: "Quận 3", wards: [ { id: 2201, name: "Phường 1" }, { id: 2202, name: "Phường 2" }, { id: 2203, name: "Phường 3" } ] }
        ]
    },
    {
        id: 3,
        name: "Đà Nẵng",
        districts: [
            { id: 301, name: "Hải Châu", wards: [ { id: 3001, name: "Hòa Cường Bắc" }, { id: 3002, name: "Hòa Cường Nam" }, { id: 3003, name: "Hòa Thuận Đông" } ] },
            { id: 302, name: "Thanh Khê", wards: [ { id: 3101, name: "An Khê" }, { id: 3102, name: "Chính Gián" }, { id: 3103, name: "Hòa Khê" } ] }
        ]
    }
];

// Hàm lấy danh sách tỉnh
function getProvinces() {
    return provincesData.map(p => ({ id: p.id, name: p.name }));
}

// Hàm lấy quận/huyện theo tỉnh
function getDistricts(provinceId) {
    const province = provincesData.find(p => p.id == provinceId);
    return province ? province.districts.map(d => ({ id: d.id, name: d.name })) : [];
}

// Hàm lấy phường/xã theo quận
function getWards(districtId) {
    for (let p of provincesData) {
        const district = p.districts.find(d => d.id == districtId);
        if (district) return district.wards.map(w => ({ id: w.id, name: w.name }));
    }
    return [];
}

// Hàm khởi tạo các select tỉnh/huyện/xã trong form
function initLocationSelects() {
    const provinceSelect = document.getElementById('province');
    if (!provinceSelect) return;

    // Điền tỉnh
    const provinces = getProvinces();
    provinceSelect.innerHTML = '<option value="">Chọn tỉnh/thành</option>';
    provinces.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        provinceSelect.appendChild(opt);
    });

    const districtSelect = document.getElementById('district');
    const wardSelect = document.getElementById('ward');

    provinceSelect.addEventListener('change', function() {
        const provinceId = this.value;
        districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
        districtSelect.disabled = !provinceId;
        wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
        wardSelect.disabled = true;
        if (provinceId) {
            const districts = getDistricts(provinceId);
            districts.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = d.name;
                districtSelect.appendChild(opt);
            });
        }
    });

    districtSelect.addEventListener('change', function() {
        const districtId = this.value;
        wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
        wardSelect.disabled = !districtId;
        if (districtId) {
            const wards = getWards(districtId);
            wards.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w.id;
                opt.textContent = w.name;
                wardSelect.appendChild(opt);
            });
        }
    });
}