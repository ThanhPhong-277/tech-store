// data.js

// Danh sách 100 sản phẩm độc nhất (20 sản phẩm cho mỗi 5 danh mục) - CHỈ ASUS ROG
const sampleProducts = [
    // === LAPTOP GAMING (20) ===
    { id: 1, name: 'ROG Strix Scar 18 (2024)', category: 'laptop', price: 95000000, stock: 10, image: 'https://th.bing.com/th/id/OIP.guAlHJ5QHTPnd0afWH7vEQHaEK?w=239&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', description: 'Laptop gaming mạnh nhất thế giới với màn hình 18 inch Nebula HDR.', colors: ['Black'] },
    { id: 2, name: 'ROG Zephyrus G16 (2024)', category: 'laptop', price: 65990000, stock: 15, image: 'https://th.bing.com/th/id/OIP.9z2Hm8dtGjgei3RV8nkglgHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', description: 'Laptop gaming mỏng nhẹ với màn hình OLED 240Hz siêu đẹp.', colors: ['Eclipse Gray', 'Platinum White'] },
    { id: 3, name: 'ROG Flow X16 (2024)', category: 'laptop', price: 48990000, stock: 8, image: 'https://tse4.mm.bing.net/th/id/OIP.siZT51GU_L1AXnXmZyzVEQHaFc?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Laptop gaming xoay gập 360 độ với màn hình Mini LED.', colors: ['Off Black'] },
    { id: 4, name: 'ROG Zephyrus G14 (2024)', category: 'laptop', price: 45990000, stock: 12, image: 'https://dlcdnwebimgs.asus.com/gain/BA146EC2-FF9D-4A8E-A91A-C9F864DE6BBB', description: 'Laptop gaming 14 inch mạnh mẽ nhất với màn hình OLED.', colors: ['Eclipse Gray', 'Platinum White'] },
    { id: 5, name: 'ROG Strix G18 (2024)', category: 'laptop', price: 38990000, stock: 20, image: 'https://dlcdnwebimgs.asus.com/gain/FFD7661F-A5FE-4061-B417-8833F0EE26AE', description: 'Thiết kế đậm chất eSport, tản nhiệt 3 quạt thông minh.', colors: ['Eclipse Gray'] },
    { id: 6, name: 'ROG Flow Z13 (2024)', category: 'laptop', price: 42000000, stock: 5, image: 'https://th.bing.com/th/id/OIP.JP3e5lyz4uXduBuQJSD_6gHaHa?w=165&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', description: 'Máy tính bảng gaming mạnh nhất thế giới.', colors: ['Black'] },
    { id: 7, name: 'ROG Zephyrus Duo 16', category: 'laptop', price: 92000000, stock: 3, image: 'https://th.bing.com/th/id/OIP.NsUXsWF0ZWjq-nGQrUBNyQHaEK?w=323&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', description: 'Laptop hai màn hình độc đáo cho streamer và creator.', colors: ['Black'] },
    { id: 8, name: 'ROG Strix Scar 16 (2024)', category: 'laptop', price: 82000000, stock: 7, image: 'https://th.bing.com/th/id/OIP.7kdY-kMoZCfwpfIZNjhcjgHaGh?w=176&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', description: 'Màn hình Mini LED Nebula HDR cực đỉnh.', colors: ['Black'] },
    { id: 9, name: 'ROG Zephyrus M16', category: 'laptop', price: 58000000, stock: 4, image: 'https://th.bing.com/th/id/OIP.tnFAO8sBUxtdb4dYiWA1awHaHa?w=148&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', description: 'Laptop gaming mỏng nhẹ màn hình 16 inch 240Hz.', colors: ['Off Black'] },
    { id: 10, name: 'ROG Flow X13 (2024)', category: 'laptop', price: 35990000, stock: 10, image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_SdhoOAjplJun-byCy1ZWu1n4M8k_xEsETafl4efun0448kXshyETPqW0tm0L', description: 'Laptop gaming 13 inch linh hoạt nhất.', colors: ['Black'] },
    { id: 11, name: 'ROG Strix G16 (2024)', category: 'laptop', price: 32990000, stock: 15, image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQn6793eb4GfWexd7MgC44R-lvzmreegTV-D_LT3XBXXqeBCg7KicmSnBPnyz4g', description: 'Hiệu năng mạnh mẽ với thiết kế ROG cá tính.', colors: ['Volt Green', 'Eclipse Gray'] },
    { id: 12, name: 'ROG Strix Scar 17', category: 'laptop', price: 68000000, stock: 6, image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Sức mạnh AMD Ryzen 9 cực khủng.', colors: ['Off Black'] },
    { id: 13, name: 'ROG Strix G17 (2024)', category: 'laptop', price: 34500000, stock: 12, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFPmIUWlyD2c92A2S_ZhVWfd8Y4pFikEW9zZ7dlcQLSam6DahkZCTgiyIK9XRA', description: 'Màn hình 17 inch rộng rãi cho trải nghiệm gaming.', colors: ['Eclipse Gray'] },
    { id: 14, name: 'ROG Zephyrus G15', category: 'laptop', price: 31000000, stock: 8, image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTtoLlIzPlvNbnixJuRPLoIircZ1upaI5qKwt52BUSxgkxg8RZ6sPuKSLCVhv1U', description: 'Sự cân bằng hoàn hảo giữa hiệu năng và tính di động.', colors: ['Moonlight White', 'Eclipse Gray'] },
    { id: 15, name: 'ROG Strix Scar 15', category: 'laptop', price: 42000000, stock: 5, image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTtoLlIzPlvNbnixJuRPLoIircZ1upaI5qKwt52BUSxgkxg8RZ6sPuKSLCVhv1U', description: 'Laptop gaming 15 inch mạnh mẽ chuẩn thi đấu.', colors: ['Black'] },
    { id: 16, name: 'ROG Mothership GZ700', category: 'laptop', price: 185000000, stock: 2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF-YZ0D-w-kusmEmgLLUF4tYB9Z1-VG7OlDUqo3VGNV-nxns0Hx0zbRtA79sin', description: 'Siêu phẩm gaming thay thế máy để bàn.', colors: ['Black'] },
    { id: 17, name: 'ROG G703', category: 'laptop', price: 75000000, stock: 4, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKecVQiG43Cc83RzegFk6mPgZpvYv14-TuQq4ksNtgqPdaiO8PX-WQBrINOfVL', description: 'Laptop gaming truyền thống với tản nhiệt cực tốt.', colors: ['Silver'] },
    { id: 18, name: 'ROG Strix G15', category: 'laptop', price: 28000000, stock: 14, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3UB23rucBbYju15v30n20EdbX0lIRnILkmZHXjLgHfynfY22IO1ptIAFxBHHN', description: 'Phong cách gaming trẻ trung năng động.', colors: ['Electro Punk', 'Original Black'] },
    { id: 19, name: 'ROG Zephyrus S17', category: 'laptop', price: 85000000, stock: 3, image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRYuvFX15OTM4ZuTBNJkMhR1oDpQqQlsDs3xTDwmdjqL3SlD5dAUybMvinXcBoV', description: 'Laptop gaming 17 inch mỏng nhất thế giới.', colors: ['Off Black'] },
    { id: 20, name: 'ROG Zephyrus S15', category: 'laptop', price: 45000000, stock: 6, image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSfyND9WadiQj5S4iBTs3YJNi5HXM7F6nd91hgD9a5V39eR29ew_8pDLKqvo-wK', description: 'Đẳng cấp mỏng nhẹ, hiệu năng cực cao.', colors: ['Black'] },

    // === MÀN HÌNH GAMING (20) ===
    { id: 21, name: 'ROG Swift Pro PG248QP', category: 'monitor', price: 25990000, stock: 5, image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình gaming 540Hz nhanh nhất thế giới.', colors: ['Black'] },
    { id: 22, name: 'ROG Swift OLED PG32UCDM', category: 'monitor', price: 35990000, stock: 8, image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình OLED 4K 240Hz màu sắc tuyệt mỹ.', colors: ['Black'] },
    { id: 23, name: 'ROG Swift OLED PG27AQDM', category: 'monitor', price: 24500000, stock: 12, image: 'https://images.pexels.com/photos/1714341/pexels-photo-1714341.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình OLED 2K 240Hz siêu nhanh.', colors: ['Black'] },
    { id: 24, name: 'ROG Swift OLED PG42UQ', category: 'monitor', price: 42000000, stock: 3, image: 'https://images.pexels.com/photos/1999463/pexels-photo-1999463.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình OLED 42 inch trải nghiệm vô cực.', colors: ['Black'] },
    { id: 25, name: 'ROG Swift OLED PG48UQ', category: 'monitor', price: 48500000, stock: 2, image: 'https://images.pexels.com/photos/706189/pexels-photo-706189.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình OLED 48 inch kích thước lớn.', colors: ['Black'] },
    { id: 26, name: 'ROG Swift OLED PG49WCD', category: 'monitor', price: 45200000, stock: 5, image: 'https://images.pexels.com/photos/52608/pexels-photo-52608.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình OLED siêu rộng 49 inch cong.', colors: ['Black'] },
    { id: 27, name: 'ROG Swift PG32UQX', category: 'monitor', price: 69990000, stock: 2, image: 'https://images.pexels.com/photos/441963/pexels-photo-441963.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình 4K Mini LED HDR 1400.', colors: ['Black'] },
    { id: 28, name: 'ROG Swift PG279QM', category: 'monitor', price: 19500000, stock: 10, image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình 2K 240Hz Fast IPS cực mượt.', colors: ['Black'] },
    { id: 29, name: 'ROG Swift PG259QN', category: 'monitor', price: 14500000, stock: 15, image: 'https://images.pexels.com/photos/159393/pexels-photo-159393.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình 360Hz chuẩn Esport chuyên nghiệp.', colors: ['Black'] },
    { id: 30, name: 'ROG Strix XG27AQMR', category: 'monitor', price: 16500000, stock: 8, image: 'https://images.pexels.com/photos/163125/pexels-photo-163125.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình 2K 300Hz cho trải nghiệm đỉnh cao.', colors: ['Black'] },
    { id: 31, name: 'ROG Strix XG259QN', category: 'monitor', price: 12500000, stock: 12, image: 'https://images.pexels.com/photos/38568/pexels-photo-38568.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình 380Hz siêu tốc cho game FPS.', colors: ['Black'] },
    { id: 32, name: 'ROG Strix XG32UQ', category: 'monitor', price: 21500000, stock: 7, image: 'https://images.pexels.com/photos/414628/pexels-photo-414628.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình 4K 160Hz kích thước 32 inch.', colors: ['Black'] },
    { id: 33, name: 'ROG Strix XG309CM', category: 'monitor', price: 11500000, stock: 10, image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình 220Hz tỉ lệ 21:9 rộng rãi.', colors: ['Black'] },
    { id: 34, name: 'ROG Strix XG276Q', category: 'monitor', price: 9500000, stock: 14, image: 'https://images.pexels.com/photos/614117/pexels-photo-614117.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình 165Hz thiết kế bền bỉ.', colors: ['Black'] },
    { id: 35, name: 'ROG Strix XG16AHP', category: 'monitor', price: 10500000, stock: 20, image: 'https://images.pexels.com/photos/6444/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình di động 144Hz có pin tích hợp.', colors: ['White', 'Black'] },
    { id: 36, name: 'ROG Strix XG17AHP', category: 'monitor', price: 13500000, stock: 12, image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình di động 240Hz lớn nhất thế giới.', colors: ['Black'] },
    { id: 37, name: 'ROG Swift PG348Q', category: 'monitor', price: 28000000, stock: 3, image: 'https://images.pexels.com/photos/210641/pexels-photo-210641.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình cong UltraWide huyền thoại.', colors: ['Armor Titanium'] },
    { id: 38, name: 'ROG Swift PG27UQ', category: 'monitor', price: 45000000, stock: 2, image: 'https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình 4K HDR 144Hz đầu tiên.', colors: ['Black'] },
    { id: 39, name: 'ROG Swift PG35VQ', category: 'monitor', price: 62000000, stock: 1, image: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình cong HDR 200Hz cực khủng.', colors: ['Black'] },
    { id: 40, name: 'ROG Strix XG438Q', category: 'monitor', price: 32000000, stock: 4, image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình 43 inch 4K 120Hz siêu lớn.', colors: ['Black'] },

    // === BÀN PHÍM GAMING (20) ===
    { id: 41, name: 'ROG Azoth', category: 'keyboard', price: 7990000, stock: 10, image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Bàn phím cơ Custom cao cấp có màn hình OLED.', colors: ['Grey'] },
    { id: 42, name: 'ROG Strix Scope II 96 Wireless', category: 'keyboard', price: 4490000, stock: 15, image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Bàn phím 96% đầy đủ tính năng, switch ROG NX Snow.', colors: ['Black'] },
    { id: 43, name: 'ROG Strix Scope II', category: 'keyboard', price: 3290000, stock: 20, image: 'https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Bàn phím full-size hiệu năng cao.', colors: ['Black'] },
    { id: 44, name: 'ROG Falchion RX Low Profile', category: 'keyboard', price: 4690000, stock: 8, image: 'https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', description: 'Bàn phím cơ low-profile 65% siêu mỏng.', colors: ['Black'] },
    { id: 45, name: 'ROG Falchion Ace', category: 'keyboard', price: 3150000, stock: 12, image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Bàn phím 65% nhỏ gọn có thanh chạm điều khiển.', colors: ['Black', 'White'] },
    { id: 46, name: 'ROG Strix Scope RX', category: 'keyboard', price: 3490000, stock: 10, image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Switch quang học độc quyền ROG RX.', colors: ['Black'] },
    { id: 47, name: 'ROG Strix Scope NX TKL', category: 'keyboard', price: 2850000, stock: 18, image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Thiết kế TKL gọn gàng, switch ROG NX.', colors: ['Black'] },
    { id: 48, name: 'ROG Claymore II', category: 'keyboard', price: 6500000, stock: 5, image: 'https://images.pexels.com/photos/1650917/pexels-photo-1650917.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Bàn phím tháo rời cụm phím số độc đáo.', colors: ['Black'] },
    { id: 49, name: 'ROG Strix Flare II Animate', category: 'keyboard', price: 5490000, stock: 7, image: 'https://images.pexels.com/photos/220769/pexels-photo-220769.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình LED AniMe Matrix rực rỡ.', colors: ['Black'] },
    { id: 50, name: 'ROG Strix Flare II', category: 'keyboard', price: 3950000, stock: 11, image: 'https://images.pexels.com/photos/450035/pexels-photo-450035.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tần số quét 8000Hz phản hồi cực nhanh.', colors: ['Black'] },
    { id: 51, name: 'ROG Strix Scope Deluxe', category: 'keyboard', price: 3650000, stock: 9, image: 'https://images.pexels.com/photos/841228/pexels-photo-841228.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Đi kèm kê tay cực êm cho game thủ.', colors: ['Black'] },
    { id: 52, name: 'ROG Strix Scope TKL', category: 'keyboard', price: 2450000, stock: 14, image: 'https://images.pexels.com/photos/3987066/pexels-photo-3987066.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Lựa chọn TKL bền bỉ và tin cậy.', colors: ['Black'] },
    { id: 53, name: 'ROG Horus GK2000', category: 'keyboard', price: 5800000, stock: 3, image: 'https://images.pexels.com/photos/585752/pexels-photo-585752.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Thiết kế nhôm cao cấp chuẩn quân đội.', colors: ['Black'] },
    { id: 54, name: 'ROG Sagaris GK1100', category: 'keyboard', price: 1850000, stock: 15, image: 'https://images.pexels.com/photos/399160/pexels-photo-399160.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Bàn phím cơ bền bỉ cho người mới bắt đầu.', colors: ['Black'] },
    { id: 55, name: 'ROG Strix Scope PBT', category: 'keyboard', price: 2950000, stock: 12, image: 'https://images.pexels.com/photos/541484/pexels-photo-541484.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Keycap PBT cao cấp chống bóng mờ.', colors: ['Black'] },
    { id: 56, name: 'ROG Falchion', category: 'keyboard', price: 3450000, stock: 10, image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Bàn phím cơ không dây 65% có vỏ bảo vệ.', colors: ['Black'] },
    { id: 57, name: 'ROG Strix Scope RX EVA-02 Edition', category: 'keyboard', price: 4200000, stock: 4, image: 'https://images.pexels.com/photos/373076/pexels-photo-373076.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Phiên bản giới hạn Evangelion Unit-02.', colors: ['Red'] },
    { id: 58, name: 'ROG Strix Scope NX Wireless Deluxe', category: 'keyboard', price: 4850000, stock: 6, image: 'https://images.pexels.com/photos/38544/pexels-photo-38544.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Kết nối 3 chế độ linh hoạt tuyệt đối.', colors: ['Black'] },
    { id: 59, name: 'ROG Claymore', category: 'keyboard', price: 4500000, stock: 2, image: 'https://images.pexels.com/photos/3082341/pexels-photo-3082341.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Bàn phím cơ RGB đầu tiên có phím số tháo rời.', colors: ['Black'] },
    { id: 60, name: 'ROG GK2000', category: 'keyboard', price: 3200000, stock: 5, image: 'https://images.pexels.com/photos/434346/pexels-photo-434346.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Thiết kế Horus v2 tinh tế và mạnh mẽ.', colors: ['Black'] },

    // === CHUỘT GAMING (20) ===
    { id: 61, name: 'ROG Keris II Ace', category: 'mouse', price: 3490000, stock: 20, image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Chuột siêu nhẹ 54g, Polling Rate 4000Hz.', colors: ['Black', 'White'] },
    { id: 62, name: 'ROG Harpe Ace Aim Lab Edition', category: 'mouse', price: 3990000, stock: 15, image: 'https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Chuột siêu nhẹ hợp tác cùng Aim Lab.', colors: ['Black'] },
    { id: 63, name: 'ROG Gladius III Wireless AimPoint', category: 'mouse', price: 2690000, stock: 25, image: 'https://images.pexels.com/photos/680402/pexels-photo-680402.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Cảm biến AimPoint 36,000 DPI siêu chính xác.', colors: ['Black', 'White'] },
    { id: 64, name: 'ROG Spatha X', category: 'mouse', price: 3850000, stock: 10, image: 'https://images.pexels.com/photos/159438/pexels-photo-159438.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Chuột không dây 12 nút bấm cho game MMO.', colors: ['Black'] },
    { id: 65, name: 'ROG Chakram X', category: 'mouse', price: 3950000, stock: 12, image: 'https://images.pexels.com/photos/392018/pexels-photo-392018.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tích hợp Joystick điều khiển cực độc đáo.', colors: ['Black'] },
    { id: 66, name: 'ROG Keris Wireless AimPoint', category: 'mouse', price: 2490000, stock: 18, image: 'https://images.pexels.com/photos/450036/pexels-photo-450036.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Phiên bản nâng cấp cảm biến AimPoint.', colors: ['Black', 'White'] },
    { id: 67, name: 'ROG Strix Impact III Wireless', category: 'mouse', price: 1490000, stock: 30, image: 'https://images.pexels.com/photos/673648/pexels-photo-673648.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Chuột không dây nhẹ nhàng, pin cực lâu.', colors: ['Black'] },
    { id: 68, name: 'ROG Strix Impact III', category: 'mouse', price: 950000, stock: 40, image: 'https://images.pexels.com/photos/6344/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', description: 'Chuột gaming có dây giá rẻ và tin cậy.', colors: ['Black'] },
    { id: 69, name: 'ROG Pugio II', category: 'mouse', price: 2150000, stock: 15, image: 'https://images.pexels.com/photos/68525/pexels-photo-68525.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Thiết kế đối xứng có thể tùy biến nút bấm.', colors: ['Black'] },
    { id: 70, name: 'ROG Strix Evolve', category: 'mouse', price: 1250000, stock: 20, image: 'https://images.pexels.com/photos/34088/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', description: 'Vỏ chuột có thể thay đổi kiểu dáng linh hoạt.', colors: ['Black'] },
    { id: 71, name: 'ROG Sica', category: 'mouse', price: 850000, stock: 25, image: 'https://images.pexels.com/photos/3175983/pexels-photo-3175983.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Chuột đối xứng đơn giản cho game MOBA.', colors: ['Black', 'White'] },
    { id: 72, name: 'ROG Gladius II Origin', category: 'mouse', price: 1650000, stock: 18, image: 'https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Dòng chuột công thái học huyền thoại.', colors: ['Black'] },
    { id: 73, name: 'ROG Gladius II Core', category: 'mouse', price: 1150000, stock: 22, image: 'https://images.pexels.com/photos/37461/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', description: 'Phiên bản rút gọn nhẹ hơn của Gladius II.', colors: ['Black'] },
    { id: 74, name: 'ROG Keris', category: 'mouse', price: 1350000, stock: 14, image: 'https://images.pexels.com/photos/161440/pexels-photo-161440.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Chuột siêu nhẹ cho game thủ FPS.', colors: ['Black'] },
    { id: 75, name: 'ROG Strix Impact II Moonlight White', category: 'mouse', price: 1150000, stock: 10, image: 'https://images.pexels.com/photos/3829226/pexels-photo-3829226.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Phiên bản trắng Moonlight sang trọng.', colors: ['White'] },
    { id: 76, name: 'ROG Gladius III', category: 'mouse', price: 1850000, stock: 12, image: 'https://images.pexels.com/photos/459655/pexels-photo-459655.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Thiết kế công thái học cải tiến mới.', colors: ['Black'] },
    { id: 77, name: 'ROG Chakram Core', category: 'mouse', price: 1950000, stock: 9, image: 'https://images.pexels.com/photos/414844/pexels-photo-414844.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Phiên bản có dây của dòng Chakram.', colors: ['Black'] },
    { id: 78, name: 'ROG Spatha', category: 'mouse', price: 3200000, stock: 5, image: 'https://images.pexels.com/photos/209151/pexels-photo-209151.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Chuột không dây cỡ lớn cực ngầu.', colors: ['Black'] },
    { id: 79, name: 'ROG GX1000 Eagle Eye', category: 'mouse', price: 2100000, stock: 3, image: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Thiết kế nhôm phay xước cực đẳng cấp.', colors: ['Silver'] },
    { id: 80, name: 'ROG Harpe Ace EVA-02 Edition', category: 'mouse', price: 4500000, stock: 6, image: 'https://images.pexels.com/photos/391401/pexels-photo-391401.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Phiên bản Evangelion giới hạn.', colors: ['Red'] },

    // === TAI NGHE GAMING (20) ===
    { id: 81, name: 'ROG Delta S Animate', category: 'headphone', price: 6490000, stock: 8, image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Màn hình LED AniMe Matrix rực rỡ.', colors: ['Black'] },
    { id: 82, name: 'ROG Delta S Wireless', category: 'headphone', price: 4990000, stock: 20, image: 'https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Kết nối không dây kép 2.4GHz và Bluetooth.', colors: ['Black'] },
    { id: 83, name: 'ROG Delta S Core', category: 'headphone', price: 2490000, stock: 25, image: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tai nghe gaming nhẹ nhất dòng Delta.', colors: ['Black'] },
    { id: 84, name: 'ROG Cetra True Wireless SpeedNova', category: 'headphone', price: 4490000, stock: 12, image: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tai nghe TWS gaming độ trễ cực thấp.', colors: ['Black', 'White'] },
    { id: 85, name: 'ROG Cetra True Wireless', category: 'headphone', price: 2150000, stock: 30, image: 'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Âm thanh không dây chuẩn gaming.', colors: ['Black', 'White'] },
    { id: 86, name: 'ROG Fusion II 500', category: 'headphone', price: 4890000, stock: 10, image: 'https://images.pexels.com/photos/374703/pexels-photo-374703.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Âm thanh vòm 7.1 tích hợp DAC Quad ESS.', colors: ['Black'] },
    { id: 87, name: 'ROG Fusion II 300', category: 'headphone', price: 3290000, stock: 15, image: 'https://images.pexels.com/photos/382297/pexels-photo-382297.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Âm thanh chất lượng cao chuẩn ROG.', colors: ['Black'] },
    { id: 88, name: 'ROG Strix Go 2.4', category: 'headphone', price: 3850000, stock: 12, image: 'https://images.pexels.com/photos/391302/pexels-photo-391302.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tai nghe không dây 2.4GHz đa nền tảng.', colors: ['Black'] },
    { id: 89, name: 'ROG Strix Go BT', category: 'headphone', price: 4200000, stock: 8, image: 'https://images.pexels.com/photos/159613/pexels-photo-159613.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Kết nối Bluetooth ổn định với chống ồn AI.', colors: ['Black'] },
    { id: 90, name: 'ROG Strix Go Core', category: 'headphone', price: 1950000, stock: 20, image: 'https://images.pexels.com/photos/576924/pexels-photo-576924.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Phiên bản có dây nhẹ nhàng linh hoạt.', colors: ['Black'] },
    { id: 91, name: 'ROG Delta', category: 'headphone', price: 3450000, stock: 14, image: 'https://images.pexels.com/photos/638943/pexels-photo-638943.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Âm thanh Hi-Res chân thực nhất.', colors: ['Black'] },
    { id: 92, name: 'ROG Delta White Edition', category: 'headphone', price: 3550000, stock: 10, image: 'https://images.pexels.com/photos/816616/pexels-photo-816616.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Sắc trắng thuần khiết và sang trọng.', colors: ['White'] },
    { id: 93, name: 'ROG Delta Origin', category: 'headphone', price: 2850000, stock: 18, image: 'https://images.pexels.com/photos/844448/pexels-photo-844448.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Phiên bản gốc với chất âm đặc trưng ROG.', colors: ['Black'] },
    { id: 94, name: 'ROG Cetra II', category: 'headphone', price: 1850000, stock: 15, image: 'https://images.pexels.com/photos/1196118/pexels-photo-1196118.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tai nghe in-ear có chống ồn ANC.', colors: ['Black'] },
    { id: 95, name: 'ROG Cetra II Core', category: 'headphone', price: 1250000, stock: 25, image: 'https://images.pexels.com/photos/1543503/pexels-photo-1543503.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tai nghe in-ear gaming đơn giản hiệu quả.', colors: ['Black'] },
    { id: 96, name: 'ROG Strix Fusion 700', category: 'headphone', price: 5500000, stock: 5, image: 'https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Kết nối đồng thời Bluetooth và USB.', colors: ['Black'] },
    { id: 97, name: 'ROG Strix Fusion 500', category: 'headphone', price: 4200000, stock: 9, image: 'https://images.pexels.com/photos/3314605/pexels-photo-3314605.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Âm thanh 7.1 có thể đồng bộ RGB qua app.', colors: ['Black'] },
    { id: 98, name: 'ROG Strix Fusion 300', category: 'headphone', price: 2950000, stock: 14, image: 'https://images.pexels.com/photos/3784424/pexels-photo-3784424.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Trải nghiệm âm thanh gaming thuần túy.', colors: ['Black'] },
    { id: 99, name: 'ROG Centurion 7.1', category: 'headphone', price: 7800000, stock: 3, image: 'https://images.pexels.com/photos/4104117/pexels-photo-4104117.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tai nghe 7.1 thực thụ với 10 màng loa.', colors: ['Black'] },
    { id: 100, name: 'ROG Delta S EVA-02 Edition', category: 'headphone', price: 6990000, stock: 5, image: 'https://images.pexels.com/photos/514333/pexels-photo-514333.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Phiên bản Evangelion giới hạn rực rỡ.', colors: ['Red'] }
];

// Dữ liệu voucher mẫu
const sampleVouchers = [
    { id: 1, code: 'WELCOME10', type: 'percent', value: 10, minOrder: 0, expiry: '2027-12-31', active: true },
    { id: 2, code: 'SALE50K', type: 'fixed', value: 50000, minOrder: 500000, expiry: '2027-06-30', active: true }
];

// Dữ liệu người dùng mẫu
const sampleUsers = [
    { id: 1, username: 'admin', email: 'admin@techstore.com', password: 'admin123', isAdmin: true },
    { id: 2, username: 'user1', email: 'user1@example.com', password: 'user123', isAdmin: false }
];

const sampleNewsPosts = [
    {
        id: 1,
        title: 'ROG Strix Scar 18 (2024) chính thức lên kệ',
        image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200',
        content: 'ROG Strix Scar 18 (2024) đã có mặt tại ROG TechStore với màn hình Nebula HDR, hiệu năng đỉnh cao và hệ thống tản nhiệt tối ưu cho gaming.\n\nTrải nghiệm trực tiếp tại cửa hàng và nhận ưu đãi dành riêng cho thành viên ROG.',
        createdAt: '2026-03-18T09:00:00.000Z',
        updatedAt: '2026-03-18T09:00:00.000Z'
    },
    {
        id: 2,
        title: 'Khai trương chi nhánh ROG Elite Store',
        image: 'https://images.pexels.com/photos/19012039/pexels-photo-19012039.jpeg?auto=compress&cs=tinysrgb&w=1200',
        content: 'Chào mừng chi nhánh mới với khu vực trải nghiệm gaming, setup battle-station và hàng loạt phụ kiện ROG.\n\nĐến ngay để nhận voucher khai trương và quà tặng giới hạn.',
        createdAt: '2026-03-15T09:00:00.000Z',
        updatedAt: '2026-03-15T09:00:00.000Z'
    },
    {
        id: 3,
        title: 'ROG Elite Rewards: Tích điểm đổi quà cực chất',
        image: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1200',
        content: 'Tích lũy ROG Points từ mỗi đơn hàng để đổi quà, voucher và phụ kiện giới hạn.\n\nBạn có thể theo dõi điểm và ưu đãi ngay trong trang tin tức.',
        createdAt: '2026-03-12T09:00:00.000Z',
        updatedAt: '2026-03-12T09:00:00.000Z'
    }
];

// Dữ liệu tỉnh/thành phố (sẽ load từ provinces.js)
let provinces = [];

// Hàm khởi tạo dữ liệu trong localStorage
function initializeData() {
    // Phiên bản dữ liệu (để ép cập nhật khi có thay đổi lớn)
    const DATA_VERSION = "3.0"; 
    const currentVersion = localStorage.getItem('data_version');

    // Nếu chưa có dữ liệu hoặc phiên bản cũ, nạp 100 sản phẩm độc nhất
    if (currentVersion !== DATA_VERSION) {
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        localStorage.setItem('data_version', DATA_VERSION);
        console.log('Đã cập nhật 100 sản phẩm ASUS ROG (v' + DATA_VERSION + ')');
    }

    // Voucher
    const existingVouchersRaw = localStorage.getItem('vouchers');
    let existingVouchers = [];
    try {
        existingVouchers = JSON.parse(existingVouchersRaw || '[]') || [];
    } catch (e) {
        existingVouchers = [];
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hasValidActiveVoucher = Array.isArray(existingVouchers) && existingVouchers.some(v => {
        if (!v || v.active !== true) return false;
        if (!v.expiry) return true;
        const exp = new Date(v.expiry);
        if (Number.isNaN(exp.getTime())) return true;
        exp.setHours(23, 59, 59, 999);
        return exp >= today;
    });
    if (!existingVouchersRaw || !Array.isArray(existingVouchers) || existingVouchers.length === 0 || !hasValidActiveVoucher) {
        localStorage.setItem('vouchers', JSON.stringify(sampleVouchers));
    }
    const existingNewsRaw = localStorage.getItem('news_posts');
    let existingNews = [];
    try {
        existingNews = JSON.parse(existingNewsRaw || '[]') || [];
    } catch (e) {
        existingNews = [];
    }
    if (!existingNewsRaw || !Array.isArray(existingNews) || existingNews.length === 0) {
        localStorage.setItem('news_posts', JSON.stringify(sampleNewsPosts));
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
}

// Gọi khi trang load
initializeData();

if (typeof initStores === 'function') {
    initStores(); // từ stores.js
}

if (!localStorage.getItem('stores') && typeof sampleStores !== 'undefined') {
    localStorage.setItem('stores', JSON.stringify(sampleStores));
}

// Tạo dữ liệu mẫu cho analytics nếu chưa có
function generateSampleAnalyticsData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        const sampleOrders = [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const products = JSON.parse(localStorage.getItem('products')) || [];
        
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const ordersCount = Math.floor(Math.random() * 5) + 1;
            
            for (let j = 0; j < ordersCount; j++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const orderProducts = [];
                let total = 0;
                
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
    }
}

generateSampleAnalyticsData();
