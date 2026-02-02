// ==========================================
// 1. DỮ LIỆU TOUR MẪU
// ==========================================
const defaultData = [
    { id: 1, name: "Tour Cao Cấp: Phú Quốc - Ngắm Hoàng Hôn 3N2Đ", price: 4500000, oldPrice: 6200000, img: "https://images.unsplash.com/photo-1589394815804-964ed96aeb33?q=80&w=500", category: "Miền Nam", duration: "3 Ngày 2 Đêm" },
    { id: 2, name: "Khám Phá Đà Lạt: Thành Phố Ngàn Hoa", price: 2900000, oldPrice: 3800000, img: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=500", category: "Miền Trung", duration: "2 Ngày 1 Đêm" },
    { id: 3, name: "Tour Vịnh Hạ Long: Du Thuyền 5 Sao", price: 3200000, oldPrice: 4500000, img: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=500", category: "Miền Bắc", duration: "2 Ngày 1 Đêm" },
    { id: 4, name: "Tour Đà Nẵng - Hội An - Bà Nà Hills", price: 5100000, oldPrice: 6500000, img: "https://images.unsplash.com/photo-1555620146-bf037d40f80d?q=80&w=500", category: "Miền Trung", duration: "4 Ngày 3 Đêm" },
    { id: 5, name: "Hành Trình Thái Lan: Bangkok - Pattaya", price: 7900000, oldPrice: 9500000, img: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?q=80&w=500", category: "Nước Ngoài", duration: "5 Ngày 4 Đêm" },
    { id: 6, name: "Tour Sapa: Chinh Phục Đỉnh Fansipan", price: 3800000, oldPrice: 4200000, img: "https://images.unsplash.com/photo-1580210452365-d4fc3448408d?q=80&w=500", category: "Miền Bắc", duration: "3 Ngày 2 Đêm" }
];

let products = JSON.parse(localStorage.getItem('thProducts')) || defaultData;
let cart = JSON.parse(localStorage.getItem('thBooking')) || [];
let tempImg = "";

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('product-list')) renderAllSections(products);
    if (document.getElementById('cart-list-container')) renderCart();
});

function renderGrid(containerId, data) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = data.map((p) => {
        let disc = p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
        return `
        <div class="product-card">
            <button class="btn-delete-card" onclick="deleteProduct(${p.id})">Xóa</button>
            ${disc > 0 ? `<div class="badge-sale"><span>-${disc}%</span></div>` : ''}
            <div class="img-container"><img src="${p.img}" class="product-img" onerror="this.src='https://via.placeholder.com/300?text=TH+Tourist'"></div>
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

window.filterCategory = function(cat, el) {
    document.querySelectorAll('.category-list li').forEach(li => li.classList.remove('active'));
    el.classList.add('active');
    const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
    renderGrid('product-list', filtered);
}

window.filterByPrice = function() {
    const min = document.getElementById('min-price').value || 0;
    const max = document.getElementById('max-price').value || Infinity;
    const filtered = products.filter(p => p.price >= min && p.price <= max);
    renderGrid('product-list', filtered);
}

// --- GIỎ HÀNG ---
window.addToCart = function(id) {
    if(document.body.classList.contains('admin-mode')) return;
    const prod = products.find(p => p.id === id);
    const item = cart.find(c => c.id === id);
    if (item) item.qty++; else cart.push({...prod, qty: 1});
    localStorage.setItem('thBooking', JSON.stringify(cart));
    updateCartCount();
    if(window.Toastify) Toastify({ text: "✅ Đã thêm tour vào danh sách đặt!", style: { background: "#003366" } }).showToast();
}

function updateCartCount() {
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
    const container = document.getElementById('cart-list-container');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:50px;">Bạn chưa chọn hành trình nào.</p>`;
        document.getElementById('temp-total').innerText = "0đ";
        document.getElementById('final-total').innerText = "0đ";
        return;
    }
    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
        <div class="cart-item-row">
            <div style="flex:2; display:flex; gap:10px; align-items:center;">
                <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">
                <div><div style="font-size:14px; font-weight:700;">${item.name}</div><div style="font-size:11px;">${item.duration}</div></div>
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
    const tStr = total.toLocaleString() + 'đ';
    document.getElementById('temp-total').innerText = tStr;
    document.getElementById('final-total').innerText = tStr;
}

window.changeQty = function(i, d) {
    cart[i].qty += d;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    localStorage.setItem('thBooking', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

window.removeItem = function(i) {
    cart.splice(i, 1);
    localStorage.setItem('thBooking', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// --- GỬI ĐẶT TOUR QUA FORMSPREE ---
window.processCheckoutPage = function() {
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    const addr = document.getElementById('c-address').value;

    if (!name || !phone || !addr) {
        alert("Vui lòng nhập thông tin liên hệ!");
        return;
    }

    const btn = document.querySelector('.btn-checkout-page');
    btn.innerText = "ĐANG GỬI YÊU CẦU...";
    btn.disabled = true;

    const tourList = cart.map(i => `- ${i.name} (${i.duration}) SL: ${i.qty}`).join("\n");
    const total = document.getElementById('final-total').innerText;

    fetch("https://formspree.io/f/xwvqqlqp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "Người Đặt": name,
            "SĐT": phone,
            "Địa Chỉ": addr,
            "Danh Sách Tour": tourList,
            "Tổng Tiền Dự Kiến": total
        })
    }).then(res => {
        if (res.ok) {
            alert(`✅ Đã gửi yêu cầu thành công!\nTH Tourist sẽ gọi lại cho quý khách sớm nhất.`);
            cart = [];
            localStorage.removeItem('thBooking');
            window.location.href = 'index.html';
        } else {
            alert("❌ Lỗi gửi đơn hàng!");
            btn.innerText = "XÁC NHẬN ĐẶT TOUR";
            btn.disabled = false;
        }
    });
}

// --- ADMIN ---
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
        duration: document.getElementById('p-duration').value || "Theo lịch trình",
        img: tempImg || "https://via.placeholder.com/300"
    };
    products.unshift(p);
    localStorage.setItem('thProducts', JSON.stringify(products));
    location.reload();
}

window.deleteProduct = function(id) {
    if(confirm("Xóa tour này?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('thProducts', JSON.stringify(products));
        location.reload();
    }
}

window.resetData = function() {
    localStorage.removeItem('thProducts');
    location.reload();
}
