const defaultData = [
    { id: 1, name: "Tour Phú Quốc: Ngắm Hoàng Hôn 3N2Đ", price: 4500000, oldPrice: 6200000, img: "https://images.unsplash.com/photo-1589394815804-964ed96aeb33?w=500", category: "Miền Nam", duration: "3 Ngày 2 Đêm", desc: "Hành trình nghỉ dưỡng tuyệt vời tại Đảo Ngọc Phú Quốc với lịch trình tham quan VinWonders, Safari và thưởng thức hải sản tươi sống." },
    { id: 2, name: "Khám Phá Đà Lạt: Thành Phố Ngàn Hoa", price: 2900000, oldPrice: 3800000, img: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=500", category: "Miền Trung", duration: "2 Ngày 1 Đêm", desc: "Tận hưởng không khí se lạnh, tham quan vườn hoa thành phố, Thung Lũng Tình Yêu và chợ đêm Đà Lạt huyền ảo." },
    { id: 3, name: "Tour Vịnh Hạ Long: Du Thuyền 5 Sao", price: 3200000, oldPrice: 4500000, img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=500", category: "Miền Bắc", duration: "2 Ngày 1 Đêm", desc: "Trải nghiệm ngủ đêm trên du thuyền sang trọng, khám phá các hang động kỳ vĩ và chèo kayak trên làn nước xanh ngắt." }
];

let products = JSON.parse(localStorage.getItem('jiaoTours')) || defaultData;
let cart = JSON.parse(localStorage.getItem('jiaoBooking')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('product-list')) renderAll(products);
    if (document.getElementById('cart-list-container')) renderCart();
});

function renderAll(data) {
    const list = document.getElementById('product-list');
    if (!list) return;
    list.innerHTML = data.map(p => `
        <div class="product-card" onclick="openTourDetail(${p.id})">
            <div class="img-container"><img src="${p.img}" class="product-img"></div>
            <div class="p-details">
                <div class="p-title">${p.name}</div>
                <div class="p-price">${p.price.toLocaleString()}đ</div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">ĐẶT TOUR</button>
            </div>
        </div>`).join('');
}

window.openTourDetail = function(id) {
    const p = products.find(x => x.id === id);
    document.getElementById('modal-img').src = p.img;
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-duration').innerText = p.duration;
    document.getElementById('modal-category').innerText = p.category;
    document.getElementById('modal-price').innerText = p.price.toLocaleString() + 'đ';
    document.getElementById('modal-old-price').innerText = p.oldPrice ? p.oldPrice.toLocaleString() + 'đ' : '';
    document.getElementById('modal-desc').innerText = p.desc || "Hành trình khám phá cùng TRIEUHAOTRAVEL.";
    document.getElementById('modal-book-btn').onclick = () => { addToCart(p.id); closeTourDetail(); };
    document.getElementById('tour-detail-modal').style.display = 'block';
};

window.closeTourDetail = () => document.getElementById('tour-detail-modal').style.display = 'none';

window.addToCart = function(id) {
    const p = products.find(x => x.id === id);
    const item = cart.find(x => x.id === id);
    if (item) item.qty++; else cart.push({...p, qty: 1});
    localStorage.setItem('jiaoBooking', JSON.stringify(cart));
    updateCartCount();
    Toastify({ text: "✅ Đã thêm vào danh sách!", style: { background: "#003366" } }).showToast();
};

function updateCartCount() {
    const b = document.getElementById('cart-count');
    if (b) b.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
    const c = document.getElementById('cart-list-container');
    if (!c || cart.length === 0) { c.innerHTML = "<p>Chưa có tour nào.</p>"; return; }
    let total = 0;
    c.innerHTML = cart.map((item, i) => {
        total += item.price * item.qty;
        return `<div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
            <span>${item.name} (x${item.qty})</span>
            <span>${(item.price * item.qty).toLocaleString()}đ</span>
        </div>`;
    }).join('');
    document.getElementById('final-total').innerText = total.toLocaleString() + 'đ';
}

window.processCheckoutPage = function() {
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    if (!name || !phone) { alert("Vui lòng điền thông tin!"); return; }
    
    fetch("https://formspree.io/f/xwvqqlqp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, tours: cart.map(i => i.name).join(', ') })
    }).then(() => {
        alert("✅ Đã nhận yêu cầu đặt tour!");
        cart = []; localStorage.removeItem('jiaoBooking'); window.location.href = 'index.html';
    });
};

window.toggleAdminPanel = () => { document.getElementById('admin-panel').classList.toggle('open'); };
window.saveProduct = () => {
    const p = { id: Date.now(), name: document.getElementById('p-name').value, price: Number(document.getElementById('p-price').value), category: document.getElementById('p-category').value, desc: document.getElementById('p-desc').value, img: "https://via.placeholder.com/500" };
    products.unshift(p); localStorage.setItem('jiaoTours', JSON.stringify(products)); location.reload();
};
