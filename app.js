// --- DỮ LIỆU TOUR ---
const defaultTours = [
    { id: 1, name: "Tour Phú Quốc: Ngắm Hoàng Hôn 3N2Đ", price: 4500000, oldPrice: 6200000, img: "https://images.unsplash.com/photo-1589394815804-964ed96aeb33?w=500", category: "Miền Nam", duration: "3 Ngày 2 Đêm", desc: "Hành trình nghỉ dưỡng tuyệt vời tại Đảo Ngọc Phú Quốc. Tham quan VinWonders, ngắm hoàng hôn tại Sunset Sanato và thưởng thức hải sản." },
    { id: 2, name: "Khám Phá Đà Lạt: Thành Phố Ngàn Hoa", price: 2900000, oldPrice: 3800000, img: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=500", category: "Miền Trung", duration: "2 Ngày 1 Đêm", desc: "Tận hưởng không khí se lạnh, tham quan Vườn Hoa Thành Phố, Thung Lũng Tình Yêu và chợ đêm Đà Lạt." },
    { id: 3, name: "Tour Vịnh Hạ Long: Du Thuyền 5 Sao", price: 3200000, oldPrice: 4500000, img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=500", category: "Miền Bắc", duration: "2 Ngày 1 Đêm", desc: "Trải nghiệm ngủ đêm trên vịnh, chèo kayak khám phá các hang động kỳ vĩ." }
];

let products = JSON.parse(localStorage.getItem('jiaoTours')) || defaultTours;
let cart = JSON.parse(localStorage.getItem('jiaoBooking')) || [];
let tempImg = "";

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('product-list')) renderAll(products);
    if (document.getElementById('cart-list-container')) renderCart();
});

// --- HIỂN THỊ TOUR ---
function renderGrid(containerId, data) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = data.map(p => {
        let disc = p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
        return `
        <div class="product-card" onclick="openTourDetail(${p.id})">
            <button class="btn-delete-card" onclick="event.stopPropagation(); deleteProduct(${p.id})">Xóa</button>
            ${disc > 0 ? `<div class="badge-sale">-${disc}%</div>` : ''}
            <div class="img-container"><img src="${p.img}" class="product-img"></div>
            <div class="p-details">
                <div class="p-title">${p.name}</div>
                <div class="p-price">${p.price.toLocaleString()}đ</div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">ĐẶT TOUR</button>
            </div>
        </div>`;
    }).join('');
}

function renderAll(data) {
    renderGrid('flash-sale-list', data.slice(0, 3));
    renderGrid('product-list', data);
}

// --- MỞ CHI TIẾT TOUR ---
window.openTourDetail = function(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('modal-img').src = p.img;
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-duration').innerHTML = `<i class="fas fa-clock"></i> ${p.duration || 'Theo yêu cầu'}`;
    document.getElementById('modal-category').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${p.category}`;
    document.getElementById('modal-price').innerText = p.price.toLocaleString() + 'đ';
    document.getElementById('modal-desc').innerText = p.desc || "Hành trình khám phá cùng TRIEUHAOTRAVEL.";
    
    // Nút đặt trong modal
    document.getElementById('modal-book-btn').onclick = () => { addToCart(p.id); closeTourDetail(); };
    
    document.getElementById('tour-detail-modal').style.display = 'flex';
};

window.closeTourDetail = () => {
    document.getElementById('tour-detail-modal').style.display = 'none';
};

// --- GIỎ HÀNG ---
window.addToCart = function(id) {
    const p = products.find(x => x.id === id);
    const item = cart.find(x => x.id === id);
    if (item) item.qty++; else cart.push({...p, qty: 1});
    localStorage.setItem('jiaoBooking', JSON.stringify(cart));
    updateCartCount();
    Toastify({ text: "✅ Đã thêm tour!", style: { background: "#003366" } }).showToast();
};

function updateCartCount() {
    const b = document.getElementById('cart-count');
    if (b) b.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
    const c = document.getElementById('cart-list-container');
    if (!c) return;
    if (cart.length === 0) { c.innerHTML = "<p>Chưa có tour nào.</p>"; return; }
    let total = 0;
    c.innerHTML = cart.map((item, i) => {
        total += item.price * item.qty;
        return `<div class="cart-item-row" style="display:flex; justify-content:space-between; padding:15px; background:white; margin-bottom:10px; border-radius:8px;">
            <span><b>${item.name}</b> (x${item.qty})</span>
            <span>${(item.price * item.qty).toLocaleString()}đ</span>
        </div>`;
    }).join('');
    document.getElementById('final-total').innerText = total.toLocaleString() + 'đ';
}

// --- ĐẶT HÀNG (FORMSPREE) ---
window.processCheckoutPage = function() {
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    if (!name || !phone || cart.length === 0) { alert("Vui lòng nhập đủ thông tin!"); return; }

    const btn = document.querySelector('.btn-checkout-page');
    btn.innerText = "ĐANG GỬI..."; btn.disabled = true;

    fetch("https://formspree.io/f/xwvqqlqp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            "Khách hàng": name, 
            "SĐT": phone, 
            "Địa chỉ": document.getElementById('c-address').value,
            "Tours": cart.map(i => `${i.name} (x${i.qty})`).join(', '),
            "Tổng tiền": document.getElementById('final-total').innerText
        })
    }).then(() => {
        alert("✅ Đã nhận yêu cầu đặt tour!");
        cart = []; localStorage.removeItem('jiaoBooking'); window.location.href = 'index.html';
    }).catch(() => {
        alert("Lỗi kết nối!"); btn.disabled = false; btn.innerText = "XÁC NHẬN";
    });
};

// --- ADMIN ---
window.toggleAdminPanel = () => document.getElementById('admin-panel').classList.toggle('open');
document.getElementById('p-file')?.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (evt) => { tempImg = evt.target.result; };
    reader.readAsDataURL(e.target.files[0]);
});

window.saveProduct = function() {
    const p = {
        id: Date.now(),
        name: document.getElementById('p-name').value,
        price: Number(document.getElementById('p-price').value),
        oldPrice: Number(document.getElementById('p-old-price').value),
        category: document.getElementById('p-category').value,
        duration: document.getElementById('p-duration').value,
        desc: document.getElementById('p-desc').value,
        img: tempImg || "https://via.placeholder.com/500"
    };
    products.unshift(p);
    localStorage.setItem('jiaoTours', JSON.stringify(products));
    location.reload();
};

window.deleteProduct = function(id) {
    if(confirm("Xóa Tour này?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('jiaoTours', JSON.stringify(products));
        location.reload();
    }
}

window.resetData = () => { localStorage.removeItem('jiaoTours'); location.reload(); };
