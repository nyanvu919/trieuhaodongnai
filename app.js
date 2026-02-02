// ==========================================
// 1. DỮ LIỆU TOUR MẪU (Lưu vào LocalStorage)
// ==========================================
const defaultTours = [
    { 
        id: 1, 
        name: "Tour Cao Cấp: Phú Quốc - Ngắm Hoàng Hôn 3N2Đ", 
        price: 4500000, 
        oldPrice: 6200000, 
        img: "https://images.unsplash.com/photo-1589394815804-964ed96aeb33?q=80&w=1000", 
        category: "Miền Nam", 
        duration: "3 Ngày 2 Đêm",
        desc: "Khám phá đảo ngọc Phú Quốc với hành trình đẳng cấp. \n- Tham quan Grand World - Thành phố không ngủ.\n- Trải nghiệm cáp treo vượt biển dài nhất thế giới.\n- Lặn ngắm san hô tại quần đảo An Thới.\n- Thưởng thức tiệc hải sản tươi sống trên bãi biển."
    },
    { 
        id: 2, 
        name: "Khám Phá Đà Lạt: Thành Phố Ngàn Hoa 2N1Đ", 
        price: 2900000, 
        oldPrice: 3800000, 
        img: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=1000", 
        category: "Miền Trung", 
        duration: "2 Ngày 1 Đêm",
        desc: "Tận hưởng không khí se lạnh của cao nguyên Lâm Viên. \n- Check-in Quảng trường Lâm Viên, Vườn hoa thành phố.\n- Tham quan Thác Datanla, Đường hầm đất sét.\n- Thưởng thức lẩu gà lá é và cà phê view thung lũng cực chill."
    },
    { 
        id: 3, 
        name: "Tour Vịnh Hạ Long: Du Thuyền 5 Sao Đẳng Cấp", 
        price: 3200000, 
        oldPrice: 4500000, 
        img: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000", 
        category: "Miền Bắc", 
        duration: "2 Ngày 1 Đêm",
        desc: "Trải nghiệm một đêm ngủ trên vịnh di sản thiên nhiên thế giới. \n- Tham quan Hang Sửng Sốt, Đảo Ti Tốp.\n- Chèo thuyền Kayak khám phá các hang động kỳ vĩ.\n- Lớp học nấu ăn và tập dưỡng sinh trên boong tàu vào buổi sáng."
    }
];

// Khởi tạo dữ liệu từ bộ nhớ máy khách
let products = JSON.parse(localStorage.getItem('jiaoTours')) || defaultTours;
let cart = JSON.parse(localStorage.getItem('jiaoBooking')) || [];
let tempImg = ""; // Lưu ảnh tạm khi Admin upload

// ==========================================
// 2. TỰ ĐỘNG CHẠY KHI TẢI TRANG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Kiểm tra trang hiện tại dựa trên ID phần tử có trong HTML
    if (document.getElementById('product-list')) {
        renderHome(products); // Đang ở Trang chủ
    } 
    
    if (document.getElementById('detail-title')) {
        renderDetail(); // Đang ở Trang Chi tiết
    }

    if (document.getElementById('cart-list-container')) {
        renderCart(); // Đang ở Trang Giỏ hàng
    }
});

// ==========================================
// 3. LOGIC TRANG CHỦ (Home)
// ==========================================

function renderHome(data) {
    const grid = document.getElementById('product-list');
    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:50px;">Không tìm thấy Tour nào phù hợp.</p>`;
        return;
    }

    grid.innerHTML = data.map(p => {
        let disc = p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
        return `
        <div class="product-card">
            <button class="btn-delete-card" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            ${disc > 0 ? `<div class="badge-sale">-${disc}%</div>` : ''}
            <div class="img-container">
                <img src="${p.img}" class="product-img" onerror="this.src='https://via.placeholder.com/400x250?text=TRIEUHAOTRAVEL'">
            </div>
            <div class="p-details">
                <div style="font-size:12px; color:#003366; font-weight:700; margin-bottom:5px;">
                    <i class="fas fa-clock"></i> ${p.duration || 'Liên hệ'}
                </div>
                <div class="p-title">${p.name}</div>
                <div class="p-price">${p.price.toLocaleString()}đ</div>
                <div class="btn-group">
                    <a href="detail.html?id=${p.id}" class="btn-detail">CHI TIẾT</a>
                    <button class="btn-book" onclick="addToCart(${p.id})">ĐẶT TOUR</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

// Lọc Danh mục
window.filterCategory = function(cat, el) {
    document.querySelectorAll('.category-list li').forEach(li => li.classList.remove('active'));
    el.classList.add('active');
    const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
    renderHome(filtered);
};

// Lọc Giá
window.filterByPrice = function() {
    const min = document.getElementById('min-price').value || 0;
    const max = document.getElementById('max-price').value || Infinity;
    const filtered = products.filter(p => p.price >= min && p.price <= max);
    renderHome(filtered);
};

// ==========================================
// 4. LOGIC TRANG CHI TIẾT (detail.html)
// ==========================================

function renderDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const p = products.find(x => x.id === id);

    if (!p) {
        document.querySelector('main').innerHTML = `<div class="container" style="text-align:center; padding:100px;"><h2>Không tìm thấy Tour!</h2><a href="index.html">Quay lại trang chủ</a></div>`;
        return;
    }

    // Đổ dữ liệu vào trang detail.html
    document.title = p.name + " - TRIEUHAOTRAVEL";
    document.getElementById('detail-img').src = p.img;
    document.getElementById('detail-title').innerText = p.name;
    document.getElementById('detail-duration').innerHTML = `<i class="far fa-clock"></i> ${p.duration}`;
    document.getElementById('detail-category').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${p.category}`;
    document.getElementById('detail-price').innerText = p.price.toLocaleString() + 'đ';
    
    if (p.oldPrice > p.price) {
        const oldPriceEl = document.getElementById('detail-old-price');
        if (oldPriceEl) {
            oldPriceEl.innerText = p.oldPrice.toLocaleString() + 'đ';
            oldPriceEl.style.display = 'inline';
        }
    }

    document.getElementById('detail-desc').innerText = p.desc || "Hành trình khám phá tuyệt vời cùng TRIEUHAOTRAVEL đang chờ đón bạn.";

    // Nút đặt tour trong trang chi tiết
    const bookBtn = document.getElementById('detail-book-btn');
    if (bookBtn) {
        bookBtn.onclick = () => {
            addToCart(p.id);
            window.location.href = 'cart.html';
        };
    }
}

// ==========================================
// 5. LOGIC GIỎ HÀNG (Booking)
// ==========================================

window.addToCart = function(id) {
    if(document.body.classList.contains('admin-mode')) return;

    const prod = products.find(p => p.id === id);
    const itemInCart = cart.find(c => c.id === id);

    if (itemInCart) {
        itemInCart.qty++;
    } else {
        cart.push({...prod, qty: 1});
    }

    localStorage.setItem('jiaoBooking', JSON.stringify(cart));
    updateCartCount();
    
    if (window.Toastify) {
        Toastify({ text: "✅ Đã thêm vào danh sách đặt tour!", duration: 2000, style: { background: "#003366" } }).showToast();
    }
};

function updateCartCount() {
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
    const container = document.getElementById('cart-list-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:50px;">Danh sách trống. Hãy chọn Tour bạn thích!</p>`;
        document.getElementById('final-total').innerText = "0đ";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        let itemTotal = item.price * item.qty;
        total += itemTotal;
        return `
        <div class="cart-item-row" style="display:flex; justify-content:space-between; padding:15px; background:white; margin-bottom:10px; border-radius:10px; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
            <img src="${item.img}" style="width:70px; height:70px; object-fit:cover; border-radius:5px;">
            <div style="flex:1; margin-left:15px;">
                <div style="font-weight:700; font-size:14px; color:#003366;">${item.name}</div>
                <div style="font-size:12px; color:#666;">${item.qty} người đi</div>
            </div>
            <div style="width:120px; text-align:right;">
                <div style="font-weight:800; color:#d00000;">${itemTotal.toLocaleString()}đ</div>
                <button onclick="removeItem(${index})" style="border:none; background:none; color:#999; cursor:pointer; font-size:12px;">Xóa</button>
            </div>
        </div>`;
    }).join('');

    document.getElementById('final-total').innerText = total.toLocaleString() + 'đ';
    if(document.getElementById('temp-total')) document.getElementById('temp-total').innerText = total.toLocaleString() + 'đ';
}

window.removeItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('jiaoBooking', JSON.stringify(cart));
    renderCart();
    updateCartCount();
};

// ==========================================
// 6. GỬI ĐƠN HÀNG QUA FORMSPREE
// ==========================================

window.processCheckoutPage = function() {
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    const address = document.getElementById('c-address').value;

    if (!name || !phone || !address) {
        alert("Vui lòng điền đầy đủ thông tin để TRIEUHAOTRAVEL liên hệ!");
        return;
    }

    if (cart.length === 0) {
        alert("Bạn chưa chọn Tour nào!");
        return;
    }

    const btn = document.querySelector('.btn-checkout-page');
    btn.innerText = "ĐANG GỬI YÊU CẦU...";
    btn.disabled = true;

    // Chuẩn bị dữ liệu gửi đi
    const listTour = cart.map(i => `- ${i.name} (SL: ${i.qty} người)`).join("\n");
    const total = document.getElementById('final-total').innerText;

    const payload = {
        "Họ Tên Khách": name,
        "Số Điện Thoại": phone,
        "Địa Chỉ": address,
        "Danh Sách Tour": listTour,
        "Tổng Tiền Dự Kiến": total
    };

    // LINK FORMSPREE CỦA BẠN
    fetch("https://formspree.io/f/xwvqqlqp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (res.ok) {
            alert(`✅ Gửi yêu cầu thành công!\nCảm ơn ${name}, TRIEUHAOTRAVEL sẽ gọi lại cho bạn qua số ${phone} ngay.`);
            cart = [];
            localStorage.removeItem('jiaoBooking');
            window.location.href = 'index.html';
        } else {
            alert("❌ Lỗi gửi yêu cầu. Vui lòng thử lại!");
            btn.innerText = "XÁC NHẬN ĐẶT TOUR";
            btn.disabled = false;
        }
    })
    .catch(() => {
        alert("❌ Lỗi kết nối mạng!");
        btn.disabled = false;
        btn.innerText = "XÁC NHẬN ĐẶT TOUR";
    });
};

// ==========================================
// 7. LOGIC ADMIN (QUẢN LÝ TOUR)
// ==========================================

window.toggleAdminPanel = function() {
    const panel = document.getElementById('admin-panel');
    if (panel) {
        panel.classList.toggle('open');
        document.body.classList.toggle('admin-mode');
    }
};

// Xử lý upload ảnh (FileReader)
const fileInput = document.getElementById('p-file');
if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => { tempImg = evt.target.result; };
            reader.readAsDataURL(file);
        }
    });
}

window.saveProduct = function() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const duration = document.getElementById('p-duration').value;
    const desc = document.getElementById('p-desc').value;

    if (!name || !price) {
        alert("Vui lòng nhập đủ tên và giá!");
        return;
    }

    const newTour = {
        id: Date.now(),
        name: name,
        price: Number(price),
        oldPrice: Number(document.getElementById('p-old-price').value) || null,
        category: document.getElementById('p-category').value,
        duration: duration || "Liên hệ",
        desc: desc || "Thông tin tour đang cập nhật...",
        img: tempImg || "https://via.placeholder.com/500?text=TRIEUHAOTRAVEL"
    };

    products.unshift(newTour);
    localStorage.setItem('jiaoTours', JSON.stringify(products));
    alert("Đã lưu Tour mới thành công!");
    location.reload();
};

window.deleteProduct = function(id) {
    if (confirm("Bạn có chắc muốn xóa Tour này?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('jiaoTours', JSON.stringify(products));
        location.reload();
    }
};

window.resetData = function() {
    if (confirm("Hành động này sẽ xóa mọi tour bạn đã thêm và quay về mặc định. Tiếp tục?")) {
        localStorage.removeItem('jiaoTours');
        location.reload();
    }
};
