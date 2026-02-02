// ==========================================
// 1. DỮ LIỆU TOUR MẪU (Lưu vào máy người dùng)
// ==========================================
const defaultData = [
    { id: 1, name: "Tour Cao Cấp: Phú Quốc - Ngắm Hoàng Hôn 3N2Đ", price: 4500000, oldPrice: 6200000, img: "https://images.unsplash.com/photo-1589394815804-964ed96aeb33?q=80&w=500", category: "Miền Nam", duration: "3 Ngày 2 Đêm" },
    { id: 2, name: "Khám Phá Đà Lạt: Thành Phố Ngàn Hoa", price: 2900000, oldPrice: 3800000, img: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=500", category: "Miền Trung", duration: "2 Ngày 1 Đêm" },
    { id: 3, name: "Tour Vịnh Hạ Long: Du Thuyền 5 Sao", price: 3200000, oldPrice: 4500000, img: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=500", category: "Miền Bắc", duration: "2 Ngày 1 Đêm" },
    { id: 4, name: "Tour Đà Nẵng - Hội An - Bà Nà Hills", price: 5100000, oldPrice: 6500000, img: "https://images.unsplash.com/photo-1555620146-bf037d40f80d?q=80&w=500", category: "Miền Trung", duration: "4 Ngày 3 Đêm" },
    { id: 5, name: "Hành Trình Thái Lan: Bangkok - Pattaya", price: 7900000, oldPrice: 9500000, img: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?q=80&w=500", category: "Nước Ngoài", duration: "5 Ngày 4 Đêm" },
    { id: 6, name: "Tour Sapa: Chinh Phục Đỉnh Fansipan", price: 3800000, oldPrice: 4200000, img: "https://images.unsplash.com/photo-1580210452365-d4fc3448408d?q=80&w=500", category: "Miền Bắc", duration: "3 Ngày 2 Đêm" }
];

let products = JSON.parse(localStorage.getItem('jiaoTours')) || defaultData;
let cart = JSON.parse(localStorage.getItem('jiaoBooking')) || [];
let tempImg = "";

// ==========================================
// 2. KHỞI CHẠY KHI VÀO WEB
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('product-list')) renderAllSections(products);
    if (document.getElementById('cart-list-container')) renderCart();
});

// --- RENDER DANH SÁCH TOUR ---
function renderGrid(containerId, data) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = data.map((p) => {
        let disc = p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
        return `
        <div class="product-card">
            <button class="btn-delete-card" onclick="deleteProduct(${p.id})">Xóa Tour</button>
            ${disc > 0 ? `<div class="badge-sale"><span>-${disc}%</span></div>` : ''}
            <div class="img-container">
                <img src="${p.img}" class="product-img" onerror="this.src='https://via.placeholder.com/300?text=Tour+Du+Lich'">
            </div>
            <div class="p-details">
                <div style="font-size:11px; color:#0056b3; font-weight:700; margin-bottom:5px;"><i class="fas fa-clock"></i> ${p.duration || 'Liên hệ'}</div>
                <div class="p-title" style="font-weight:700; height:38px;">${p.name}</div>
                <div class="p-price">${p.price.toLocaleString()}đ</div>
                <button class="add-to-cart-btn" onclick="addToCart(${p.id})">
                    <i class="fas fa-calendar-check"></i> ĐẶT TOUR NGAY
                </button>
            </div>
        </div>`;
    }).join('');
}

function renderAllSections(data) {
    renderGrid('flash-sale-list', data.slice(0, 4));
    renderGrid('product-list', data);
    renderGrid('new-arrivals-list', [...data].reverse().slice(0, 4));
}

// --- LỌC DANH MỤC ---
window.filterCategory = function(cat, el) {
    document.querySelectorAll('.category-list li').forEach(li => li.classList.remove('active'));
    el.classList.add('active');
    const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
    renderGrid('product-list', filtered);
}

// --- LỌC GIÁ ---
window.filterByPrice = function() {
    const min = document.getElementById('min-price').value || 0;
    const max = document.getElementById('max-price').value || Infinity;
    const filtered = products.filter(p => p.price >= min && p.price <= max);
    renderGrid('product-list', filtered);
}

// --- QUẢN LÝ GIỎ HÀNG (DANH SÁCH TOUR CHỌN) ---
window.addToCart = function(id) {
    if(document.body.classList.contains('admin-mode')) return;
    const prod = products.find(p => p.id === id);
    const item = cart.find(c => c.id === id);
    if (item) item.qty++; else cart.push({...prod, qty: 1});
    localStorage.setItem('jiaoBooking', JSON.stringify(cart));
    updateCartCount();
    if(window.Toastify) Toastify({ text: "✅ Đã thêm tour vào danh sách!", style: { background: "#003366" } }).showToast();
}

function updateCartCount() {
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
    const container = document.getElementById('cart-list-container');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:50px; color:#888;">Bạn chưa chọn tour nào.</p>`;
        return;
    }
    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
        <div class="cart-item-row">
            <div style="flex:2; display:flex; gap:10px; align-items:center;">
                <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">
                <div>
                    <div style="font-size:14px; font-weight:700;">${item.name}</div>
                    <div style="font-size:11px; color:#666;">${item.duration}</div>
                </div>
            </div>
            <div style="flex:1; text-align:center;">${item.price.toLocaleString()}đ</div>
            <div style="flex:1; text-align:center;">
                <button onclick="changeQty(${index}, -1)">-</button>
                <span style="margin:0 5px;">${item.qty}</span>
                <button onclick="changeQty(${index}, 1)">+</button>
            </div>
            <div style="flex:1; text-align:center; color:#003366; font-weight:700;">${(item.price * item.qty).toLocaleString()}đ</div>
            <div style="width:30px;"><i class="fas fa-trash" style="color:red; cursor:pointer;" onclick="removeItem(${index})"></i></div>
        </div>`;
    }).join('');
    const totalStr = total.toLocaleString() + 'đ';
    const tempT = document.getElementById('temp-total');
    const finalT = document.getElementById('final-total');
    if(tempT) tempT.innerText = totalStr;
    if(finalT) finalT.innerText = totalStr;
}

window.changeQty = function(i, d) {
    cart[i].qty += d;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    localStorage.setItem('jiaoBooking', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

window.removeItem = function(i) {
    cart.splice(i, 1);
    localStorage.setItem('jiaoBooking', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// ==========================================
// 3. CHỨC NĂNG ĐẶT TOUR GỬI VỀ EMAIL (FORMSPREE)
// ==========================================
window.processCheckoutPage = function() {
    const nameEl = document.getElementById('c-name');
    const phoneEl = document.getElementById('c-phone');
    const addrEl = document.getElementById('c-address');
    const finalPriceEl = document.getElementById('final-total');

    if (!nameEl || !phoneEl || !addrEl) return;

    const name = nameEl.value;
    const phone = phoneEl.value;
    const addr = addrEl.value;

    if (!name || !phone || !addr) {
        alert("Vui lòng nhập đầy đủ thông tin để JiaoTravel liên hệ!");
        return;
    }

    if (cart.length === 0) {
        alert("Danh sách tour đang trống!");
        return;
    }

    // Đổi trạng thái nút
    const btn = document.querySelector('.btn-checkout-page');
    const oldText = btn.innerText;
    btn.innerText = "ĐANG GỬI YÊU CẦU...";
    btn.disabled = true;

    // Chuẩn bị dữ liệu gửi đi
    const listTour = cart.map(i => `- ${i.name} (SL: ${i.qty} khách)`).join("\n");
    const total = finalPriceEl ? finalPriceEl.innerText : "0đ";

    const payload = {
        "Khách Hàng": name,
        "Số Điện Thoại": phone,
        "Địa Chỉ": addr,
        "Tour Đã Chọn": listTour,
        "Tổng Tiền Dự Kiến": total
    };

    // LINK FORMSPREE CỦA BẠN ĐÃ ĐƯỢC DÁN VÀO ĐÂY
    fetch("https://formspree.io/f/xwvqqlqp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (res.ok) {
            alert(`✅ Đã gửi yêu cầu thành công!\nCảm ơn ${name}, JiaoTravel sẽ gọi lại cho bạn qua số ${phone} ngay.`);
            cart = [];
            localStorage.removeItem('jiaoBooking');
            window.location.href = 'index.html';
        } else {
            alert("❌ Lỗi gửi yêu cầu. Vui lòng thử lại!");
            btn.innerText = oldText;
            btn.disabled = false;
        }
    })
    .catch(() => {
        alert("❌ Lỗi kết nối mạng!");
        btn.innerText = oldText;
        btn.disabled = false;
    });
}

// ==========================================
// 4. ADMIN PANEL (QUẢN LÝ TOUR)
// ==========================================
window.toggleAdminPanel = function() {
    document.getElementById('admin-panel').classList.toggle('open');
    document.body.classList.toggle('admin-mode');
}

document.getElementById('p-file')?.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (evt) => {
        tempImg = evt.target.result;
        document.getElementById('img-preview').innerHTML = `<img src="${tempImg}" style="width:50px; margin-top:5px;">`;
    };
    reader.readAsDataURL(e.target.files[0]);
});

window.saveProduct = function() {
    const p = {
        id: Date.now(),
        name: document.getElementById('p-name').value,
        price: Number(document.getElementById('p-price').value),
        oldPrice: Number(document.getElementById('p-old-price').value),
        category: document.getElementById('p-category').value,
        duration: document.getElementById('p-duration').value || "3 Ngày 2 Đêm",
        img: tempImg || "https://via.placeholder.com/300?text=JiaoTravel"
    };
    products.unshift(p);
    localStorage.setItem('jiaoTours', JSON.stringify(products));
    location.reload();
}

window.deleteProduct = function(id) {
    if(confirm("Bạn muốn xóa Tour này?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('jiaoTours', JSON.stringify(products));
        location.reload();
    }
}

window.resetData = function() {
    if(confirm("Khôi phục dữ liệu Tour mặc định?")) {
        localStorage.removeItem('jiaoTours');
        location.reload();
    }
}
