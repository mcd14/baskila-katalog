// --- Ana Sayfa Slider (Hero) İçerikleri ---
const heroSlides = [
    {
        badge: "🔥 DEV KAMPANYA",
        title: "2D ve 3D Anahtarlıklarda<br><span class='text-gradient'>%33 İndirim!</span>",
        desc: "Toptan alımlarda geçerli dev indirim. Kasa yanınızın yeni parlayan yıldızı stoklarla sınırlı.",
        btnText: "Fırsatı Yakala",
        img: "images/anahtarlık.jpeg"
    },
    {
        badge: "YENİ KOLEKSİYON",
        title: "Araç İçi<br><span class='text-gradient'>Premium Aksesuarlar</span>",
        desc: "Kişiye özel plaka ve iletişim numaratörleri ile aracınıza prestij katın.",
        btnText: "Hemen İncele",
        img: "images/cakmaklık gorsel.jpeg"
    }
];

let currentSlide = 0;

function updateHeroSlider() {
    const heroBg = document.getElementById('heroBg');
    const heroContent = document.getElementById('heroContent');
    const slide = heroSlides[currentSlide];

    heroContent.classList.add('fade-out');

    setTimeout(() => {
        heroBg.style.backgroundImage = `url('${slide.img}')`;
        heroContent.innerHTML = `
            <span class="hero-badge">${slide.badge}</span>
            <h1>${slide.title}</h1>
            <p>${slide.desc}</p>
            <div class="hero-buttons">
                <a href="#koleksiyon" class="btn-primary btn-lg">${slide.btnText}</a>
            </div>
        `;
        heroContent.classList.remove('fade-out');
        currentSlide = (currentSlide + 1) % heroSlides.length;
    }, 500);
}

setInterval(updateHeroSlider, 5000);

// --- Ürün Veritabanı ---
const products = [
    {
        id: 1, name: "Premium Figür Çakmak Kılıfı", category: "Çakmak Kılıfları",
        price: 100, minQty: 1, step: 1,
        description: "Canlı renkler, premium pürüzsüz yüzey ve kusursuz uyum. Çakmağınızı sımsıkı sarar.",
        image: "images/cakmaklık gorsel.jpeg", gallery: ["images/cakmaklık gorsel.jpeg", "images/anahtarlık.jpeg"]
    },
    {
        id: 2, name: "2D Anahtarlık (20'li Toptan Paket)", category: "Anahtarlıklar",
        price: 300, oldPrice: 450, minQty: 1, step: 1, 
        description: "Toptan alımlar için ideal 20 adet 2D anahtarlık içeren avantajlı paket.",
        image: "images/anahtarlık.jpeg", gallery: ["images/anahtarlık.jpeg", "images/clicker.png"]
    },
    {
        id: 3, name: "3D Flexi Ürünler (20'li Toptan Paket)", category: "Anahtarlıklar",
        price: 500, oldPrice: 750, minQty: 1, step: 1,
        description: "Son dönemin en popüler 3D hareketli (flexi) oyuncakları ve anahtarlıkları.",
        image: "images/anahtarlık.jpeg", gallery: ["images/anahtarlık.jpeg", "images/clicker.png"]
    },
    {
        id: 4, name: "Kişiye Özel Plaka Anahtarlık", category: "Araç Aksesuarları",
        price: 75, minQty: 1, step: 1,
        description: "Aracınızın plakasına özel olarak birebir 3D baskı ile üretilen, asla silinmez premium anahtarlık.",
        image: "images/clicker.png", gallery: ["images/clicker.png"]
    },
    {
        id: 5, name: "Araç İçi İletişim Numaratörü", category: "Araç Aksesuarları",
        price: 120, minQty: 1, step: 1,
        description: "Otoparklarda aracınızı bırakırken numaranızı şık bir şekilde sergileyin.",
        image: "images/cakmaklık gorsel.jpeg", gallery: ["images/cakmaklık gorsel.jpeg"]
    },
    {
        id: 6, name: "Premium Araç Logo Anahtarlık", category: "Araç Aksesuarları",
        price: 60, minQty: 1, step: 1,
        description: "Aracınızın markasına özel tasarlanmış, kabartmalı lüks anahtarlık.",
        image: "images/anahtarlık.jpeg", gallery: ["images/anahtarlık.jpeg"]
    },
    {
        id: 7, name: "Mekanik Switch Clicker", category: "Clickerlar",
        price: 60, minQty: 1, step: 1,
        description: "Gerçek klavye switch'i kullanılarak üretilmiş, stres atmaya birebir fidget oyuncak.",
        image: "images/clicker.png", gallery: ["images/clicker.png"]
    }
];

const PHONE_NUMBER = "905551911414";
const FREE_SHIPPING_THRESHOLD = 1500; 

function calculateDiscount(oldPrice, price) {
    if (!oldPrice || oldPrice <= price) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
}

// --- Sepet State Yönetimi ---
let cart = JSON.parse(localStorage.getItem('baskila_cart')) || [];

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    badge.innerText = count;
    badge.style.transform = 'translate(20%, -20%) scale(1.3)';
    setTimeout(() => badge.style.transform = 'translate(20%, -20%) scale(1)', 200);
}

function saveCart() {
    localStorage.setItem('baskila_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += product.step;
    } else {
        cart.push({ ...product, quantity: product.minQty });
    }
    
    saveCart();
    showToast(`🛒 ${product.name} sepete eklendi!`);
    closeDetailModal();
}

function updateQuantity(productId, changeMultiplier) {
    const item = cart.find(i => i.id === productId);
    if(item) {
        item.quantity += (changeMultiplier * item.step);
        if(item.quantity < item.minQty) {
            cart = cart.filter(i => i.id !== productId);
        }
        saveCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
}

function toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
    renderCartItems();
}

function renderCartItems() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const shippingFill = document.getElementById('shippingFill');
    const shippingText = document.getElementById('shippingText');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div style="text-align:center; padding: 40px 20px; color: #64748b;">Sepetiniz şu an boş.</div>';
        cartTotalEl.innerText = '₺0.00';
        if(shippingFill) shippingFill.style.width = '0%';
        if(shippingText) shippingText.innerHTML = `Kargo bedava için <strong>${FREE_SHIPPING_THRESHOLD}₺</strong> kaldı!`;
        return;
    }

    let total = 0;
    cartContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₺${item.price}.00</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span style="font-weight:700; width: 30px; text-align:center;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Sil</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    cartTotalEl.innerText = `₺${total}.00`;

    if(shippingFill && shippingText) {
        let progressPercentage = (total / FREE_SHIPPING_THRESHOLD) * 100;
        if (progressPercentage > 100) progressPercentage = 100;
        shippingFill.style.width = progressPercentage + '%';

        if (total >= FREE_SHIPPING_THRESHOLD) {
            shippingText.innerHTML = "🎉 Tebrikler! Kargonuz <strong>BEDAVA</strong>.";
            shippingFill.style.background = "#10b981"; 
        } else {
            shippingText.innerHTML = `Kargo bedava için <strong>₺${FREE_SHIPPING_THRESHOLD - total}</strong> kaldı!`;
            shippingFill.style.background = "var(--accent-gradient)"; 
        }
    }
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if(!product) return;

    document.getElementById('detailCategory').innerText = product.category;
    document.getElementById('detailTitle').innerText = product.name;
    document.getElementById('detailDesc').innerText = product.description;
    document.getElementById('mainGalleryImg').src = product.gallery[0];
    
    // Fiyatı hem içeriye hem de sabit alt bara (sticky) yazıyoruz
    const priceHtml = product.oldPrice 
        ? `<span class="modal-old-price">₺${product.oldPrice}</span> ₺${product.price}.00`
        : `₺${product.price}.00`;
    
    document.getElementById('detailPrice').innerHTML = priceHtml;
    document.getElementById('stickyPrice').innerHTML = priceHtml; // YENİ
    
    const warningEl = document.getElementById('detailWarning');
    if(product.name.includes("Paket")) {
        warningEl.style.display = 'block';
        warningEl.innerText = `Bu ürün 20'li toptan paket olarak satılmaktadır.`;
    } else {
        warningEl.style.display = 'none';
    }

    const addBtn = document.getElementById('detailAddBtn');
    addBtn.onclick = () => addToCart(product.id);

    const thumbList = document.getElementById('thumbList');
    thumbList.innerHTML = product.gallery.map((imgSrc, index) => `
        <img src="${imgSrc}" class="thumb-img ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${imgSrc}', this)">
    `).join('');

    document.getElementById('detailModal').classList.add('open');
    document.getElementById('detailOverlay').classList.add('open');
}

function changeMainImage(src, element) {
    document.getElementById('mainGalleryImg').src = src;
    document.querySelectorAll('.thumb-img').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('open');
    document.getElementById('detailOverlay').classList.remove('open');
}

// --- Ana Sayfa Vitrin Çizimi (Mobilde Tek Tıkla Sipariş İçin Güncellendi) ---
function renderProducts() {
    const container = document.getElementById('productShowcase');
    const categories = [...new Set(products.map(p => p.category))];
    
    let html = '';
    categories.forEach(category => {
        const catProducts = products.filter(p => p.category === category);
        
        html += `
            <section class="category-section">
                <h2 class="category-title fade-up">${category}</h2>
                <div class="grid">
                    ${catProducts.map(product => {
                        const discount = calculateDiscount(product.oldPrice, product.price);
                        return `
                        <div class="card fade-up">
                            <div class="card-img-wrapper" onclick="openProductModal(${product.id})">
                                ${discount ? `<div class="discount-badge">%${discount} İndirim</div>` : ''}
                                <img src="${product.image}" alt="${product.name}" class="card-img" loading="lazy">
                            </div>
                            <div class="card-body">
                                <span class="card-tag">${product.category}</span>
                                <h3 class="card-title" onclick="openProductModal(${product.id})" style="cursor:pointer;">${product.name}</h3>
                                <div class="card-price">
                                    ${product.oldPrice ? `<span class="old-price">₺${product.oldPrice}</span>` : ''}
                                    ₺${product.price}
                                </div>
                                <!-- MOBİL DOSTU TEK TIKLA SİPARİŞ ALANI -->
                                <div style="display: flex; gap: 8px; margin-top: auto;">
                                    <button class="btn-secondary" style="padding: 12px; width: 48px;" onclick="openProductModal(${product.id})" aria-label="Detaylar">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    </button>
                                    <button class="btn-primary" style="flex: 1; padding: 12px;" onclick="addToCart(${product.id})">
                                        Sepete Ekle
                                    </button>
                                </div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </section>
        `;
    });
    container.innerHTML = html;
}

function checkoutWhatsApp() {
    if (cart.length === 0) { showToast("Sepetiniz boş."); return; }
    
    let total = 0;
    let text = "Merhaba, Baskıla 3D üzerinden sipariş vermek istiyorum:\n\n";
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        text += `▪ ${item.quantity}x ${item.name} (₺${itemTotal})\n`;
    });
    
    if(total >= FREE_SHIPPING_THRESHOLD) {
        text += `\n*Genel Toplam: ₺${total}.00 (Kargo Bedava)*\n\n`;
    } else {
        text += `\n*Ara Toplam: ₺${total}.00*\n(Kargo ücreti eklenecektir)\n\n`;
    }

    text += `Ödeme ve teslimat adımları için bilgi alabilir miyim?`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast'; toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.hero').classList.add('loaded');
    updateHeroSlider(); 
    renderProducts();
    updateCartCount();
    initScrollAnimations();
    initFAQ(); 
});