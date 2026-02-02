const defaultData = [
    { id: 1, name: "Tour Phú Quốc: Ngắm Hoàng Hôn 3N2Đ", price: 4500000, oldPrice: 6200000, img: "https://images.unsplash.com/photo-1589394815804-964ed96aeb33?w=500", category: "Miền Nam", duration: "3 Ngày 2 Đêm", desc: "Khám phá đảo ngọc Phú Quốc xinh đẹp với hành trình lặn ngắm san hô, check-in Sunset Sanato và thưởng thức hải sản tươi ngon." },
    { id: 2, name: "Đà Lạt: Thành Phố Ngàn Hoa 2N1Đ", price: 2900000, oldPrice: 3800000, img: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=500", category: "Miền Trung", duration: "2 Ngày 1 Đêm", desc: "Tận hưởng không khí se lạnh, tham quan vườn hoa, ga Đà Lạt và chợ đêm rực rỡ sắc màu." },
    { id: 3, name: "Vịnh Hạ Long: Du Thuyền 5 Sao", price: 3200000, oldPrice: 4500000, img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=500", category: "Miền Bắc", duration: "2 Ngày 1 Đêm", desc: "Trải nghiệm ngủ đêm trên vịnh Hạ Long hùng vĩ, tham quan hang Sửng Sốt và chèo kayak." }
];

let products = JSON.parse(localStorage.getItem('jiaoTours')) || defaultData;
let cart = JSON.parse(localStorage.getItem('jiaoBooking')) || [];
let tempImg = "";

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('product-list')) renderHome();
    if (document.getElementById('cart-list-container')) renderCart();
});

function renderGrid(containerId, data) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = data.map(p => {
        let disc = p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
        return `
        <div class="product-card" onclick="openTourDetail(${p.id})">
            ${disc > 0 ? `<div class="badge-sale">-${disc}%</div>` : ''}
            <div class="img-container"><img src="${p.img}" class="product-img" onerror="this.src='https://via.placeholder.com/300'"></div>
            <div class="p-details">
                <div style="font-size:11px; color: #003366; font-weight:700; margin-bottom:5px;"><i class="fas fa-clock"></i> ${p.duration || 'Liên hệ'}</div>
                <div class="p-title">${p.name}</div>
                <div class="p-price">${p.price.toLocaleString()}đ</div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">ĐẶT TOUR</button>
            </div>
        </div>`;
    }).join('');
}

function renderHome() {
    renderGrid('flash-sale-list', products.slice(0, 3));
    renderGrid('product-list', products);
}

// --- MỞ CHI TIẾT TOUR ---
window.openTourDetail = function(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('modal-img').src = p.img;
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-duration').innerHTML = `<i class="fas fa-clock"></i> ${p.duration}`;
    document.getElementById('modal-category').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${p.category}`;
    document.getElementById('modal-price').innerText = p.price.toLocaleString() + 'đ';
    document.getElementById('modal-old-price').innerText = p.oldPrice ? p.oldPrice.toLocaleString() + 'đ' : '';
    document.getElementById('modal-desc').innerText = p.desc || "Hành trình khám phá cùng TRIEUHAOTRAVEL.";
    document.getElementById('modal-book-btn').onclick = () => { addToCart(p.id); closeTourDetail(); };
    document.getElementById('tour-detail-modal').style.display = 'flex';
};

window.closeTourDetail = () => { document.getElementById('tour-detail-modal').style.display = 'none'; };

// --- GIỎ HÀNG ---
window.addToCart = function(id) {
    const p = products.find(x => x.id === id);
    const item = cart.find(x => x.id === id);
    if (item) item.qty++; else cart.push({...p, qty: 1});
    localStorage.setItem('jiaoBooking', JSON.stringify(cart));
    updateCartCount();
    Toastify({ text: "✅ Đã thêm vào danh sách chờ!", style: { background: "#003366" } }).showToast();
};

function updateCartCount() {
    const b = document.getElementById('cart-count');
    if (b) b.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
    const c = document.getElementById('cart-list-container');
    if (!c) return;
    if (cart.length === 0) { c.innerHTML = "<p style='padding:20px'>Chưa có tour nào.</p>"; return; }
    let total = 0;
    c.innerHTML = cart.map((item, i) => {
        total += item.price * item.qty;
        return `<div class="cart-item-row" style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid #eee; align-items:center;">
            <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">
            <div style="flex:1; margin-left:15px"><b>${item.name}</b><br><small>${item.qty} người</small></div>
            <div style="width:120px; text-align:right"><b>${(item.price * item.qty).toLocaleString()}đ</b></div>
            <button onclick="removeItem(${i})" style="border:none; background:none; color:red; margin-left:10px; cursor:pointer"><i class="fas fa-trash"></i></button>
        </div>`;
    }).join('');
    document.getElementById('final-total').innerText = total.toLocaleString() + 'đ';
}

window.removeItem = function(i) {
    cart.splice(i, 1);
    localStorage.setItem('jiaoBooking', JSON.stringify(cart));
    renderCart();
    updateCartCount();
};

window.processCheckoutPage = function() {
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    if (!name || !phone || cart.length === 0) { alert("Vui lòng nhập đủ thông tin!"); return; }
    
    fetch("https://formspree.io/f/xwvqqlqp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            "Khách": name, "SĐT": phone, "Địa chỉ": document.getElementById('c-address').value,
            "Tours": cart.map(i => `${i.name} (x${i.qty})`).join(', '),
            "Tổng tiền": document.getElementById('final-total').innerText
        })
    }).then(() => {
        alert("✅ Đã nhận yêu cầu đặt tour! TRIEUHAOTRAVEL sẽ gọi bạn ngay.");
        cart = []; localStorage.removeItem('jiaoBooking'); window.location.href = 'index.html';
    });
};

// --- ADMIN ---
window.toggleAdminPanel = () => { document.getElementById('admin-panel').classList.toggle('open'); };
document.getElementById('p-file')?.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (evt) => { tempImg = evt.target.result; };
    reader.readAsDataURL(e.target.files[0]);
});

window.saveProduct = function() {
    const p = {
        id: Date.now(),
        name: document.getElementById('p-name').value,
        price: Number(document.getElementById('p-pric
