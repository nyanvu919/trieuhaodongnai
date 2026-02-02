// --- DỮ LIỆU ---
const defaultData = [
    { id: 1, name: "Tour Phú Quốc: Ngắm Hoàng Hôn 3N2Đ", price: 4500000, oldPrice: 6200000, img: "https://images.unsplash.com/photo-1589394815804-964ed96aeb33?w=500", category: "Miền Nam", duration: "3 Ngày 2 Đêm", desc: "Khám phá đảo ngọc Phú Quốc xinh đẹp với hành trình lặn ngắm san hô tại Hòn Móng Tay, check-in hoàng hôn tại Sunset Sanato. \n\nLịch trình tóm tắt:\n- Ngày 1: Đón khách, tham quan Grand World.\n- Ngày 2: Tour 4 đảo lặn ngắm san hô.\n- Ngày 3: Mua sắm đặc sản và tiễn khách." },
    { id: 2, name: "Đà Lạt: Thành Phố Ngàn Hoa 2N1Đ", price: 2900000, oldPrice: 3800000, img: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=500", category: "Miền Trung", duration: "2 Ngày 1 Đêm", desc: "Tận hưởng không khí se lạnh của cao nguyên Lâm Viên. Tham quan vườn hoa thành phố, Thung Lũng Tình Yêu, Ga Đà Lạt cổ kính và thưởng thức lẩu gà lá é đặc sản." },
    { id: 3, name: "Vịnh Hạ Long: Du Thuyền 5 Sao", price: 3200000, oldPrice: 4500000, img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=500", category: "Miền Bắc", duration: "2 Ngày 1 Đêm", desc: "Trải nghiệm đẳng cấp trên du thuyền 5 sao trên vịnh Hạ Long kỳ vĩ. Các hoạt động chèo thuyền kayak, thăm hang Sửng Sốt, lớp học nấu ăn trên tàu và buffet hải sản cao cấp." }
];

let products = JSON.parse(localStorage.getItem('jiaoTours')) || defaultData;
let cart = JSON.parse(localStorage.getItem('jiaoBooking')) || [];
let tempImg = "";

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // TRANG CHỦ
    if (document.getElementById('product-list')) renderHome();
    
    // TRANG CHI TIẾT
    if (document.getElementById('detail-title')) renderDetail();
    
    // TRANG GIỎ HÀNG
    if (document.getElementById('cart-list-container')) renderCart();
});

// --- RENDER TRANG CHỦ ---
function renderHome() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="product-card">
            <button class="btn-delete-card" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            <div class="img-container"><img src="${p.img}" class="product-img" onerror="this.src='https://via.placeholder.com/300'"></div>
            <div class="p-details">
                <div style="font-size:11px; color:#003366; font-weight:700; margin-bottom:5px;"><i class="fas fa-clock"></i> ${p.duration}</div>
                <div class="p-title">${p.name}</div>
                <div class="p-price">${p.price.toLocaleString()}đ</div>
                <div class="btn-group">
                    <a href="detail.html?id=${p.id}" class="btn-detail">CHI TIẾT</a>
                    <button class="btn-book" onclick="addToCart(${p.id})">ĐẶT TOUR</button>
                </div>
            </div>
        </div>`).join('');
}

// --- RENDER TRANG CHI TIẾT (QUAN TRỌNG) ---
function renderDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const p = products.find(x => x.id === id);

    if (!p) {
        document.querySelector('main').innerHTML = "<h2>Không tìm thấy Tour này!</h2><a href='index.html'>Về trang chủ</a>";
        return;
    }

    document.getElementById('detail-img').src = p.img;
    document.getElementById('detail-title').innerText = p.name;
    document.getElementById('detail-duration').innerHTML = `<i class="fas fa-clock"></i> ${p.duration}`;
    document.getElementById('detail-category').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${p.category}`;
    document.getElementById('detail-price').innerText = p.price.toLocaleString() + 'đ';
    document.getElementById('detail-desc').innerText = p.desc || "Hành trình khám phá tuyệt vời cùng TRIEUHAOTRAVEL.";
    
    document.getElementById('detail-book-btn').onclick = () => addToCart(p.id);
}

// --- GIỎ HÀNG ---
window.addToCart = function(id) {
    const p = products.find(x => x.id === id);
    const item = cart.find(x => x.id === id);
    if (item) item.qty++; else cart.push({...p, qty: 1});
    localStorage.setItem('jiaoBooking', JSON.stringify(cart));
    updateCartCount();
    Toastify({ text: "✅ Đã thêm vào danh sách đặt tour!", style: { background: "#003366" } }).showToast();
};

function updateCartCount() {
    const b = document.getElementById('cart-count');
    if (b) b.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
    const c = document.getElementById('cart-list-container');
    if (!c || cart.length === 0) { if(c) c.innerHTML = "<p>Chưa có tour nào.</p>"; return; }
    let total = 0;
    c.innerHTML = cart.map((item, i) => {
        total += item.price * item.qty;
        return `<div style="display:flex; justify-content:space-between; padding:15px; background:white; margin-bottom:10px; border-radius:8px; align-items:center;">
            <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">
            <div style="flex:1; margin-left:15px"><b>${item.name}</b><br><small>${item.qty} người</small></div>
            <div style="width:120px; text-align:right"><b>${(item.price * item.qty).toLocaleString()}đ</b></div>
            <button onclick="removeItem(${i})" style="border:none; background:none; color:red; margin-left:10px; cursor:pointer"><i class="fas fa-trash"></i></button>
        </div>`;
    }).join('');
    document.getElementById('final-total').innerText = total.toLocaleString() + 'đ';
}

window.removeItem = function(i) { cart.splice(i, 1); localStorage.setItem('jiaoBooking', JSON.stringify(cart)); renderCart(); updateCartCount(); };

window.processCheckoutPage = function() {
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    if (!name || !phone || cart.length === 0) { alert("Vui lòng điền đủ thông tin!"); return; }
    fetch("https://formspree.io/f/xwvqqlqp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, tours: cart.map(i => `${i.name} (x${i.qty})`).join(', '), total: document.getElementById('final-total').innerText })
    }).then(() => {
        alert("✅ Đã nhận yêu cầu đặt tour!");
        cart = []; localStorage.removeItem('jiaoBooking'); window.location.href = 'index.html';
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
    const p = { id: Date.now(), name: document.getElementById('p-name').value, price: Number(document.getElementById('p-price').value), category: document.getElementById('p-category').value, duration: document.getElementById('p-duration').value, desc: document.getElementById('p-desc').value, img: tempImg || "https://via.placeholder.com/500" };
    products.unshift(p); localStorage.setItem('jiaoTours', JSON.stringify(products)); location.reload();
};
window.deleteProduct = (id) => { if(confirm("Xóa Tour?")) { products = products.filter(p => p.id !== id); localStorage.setItem('jiaoTours', JSON.stringify(products)); location.reload(); } };
window.resetData = () => { localStorage.removeItem('jiaoTours'); location.reload(); };
