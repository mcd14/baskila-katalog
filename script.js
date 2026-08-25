// Ürün Verileri
const products = [
    {
        id: 1,
        name: "Figür Çakmak Kılıfları",
        category: "Çakmak Kılıfları",
        price: "₺45.00",
        wholesaleNote: "Her 12 adet ve üzeri alımlarda dükkanlar için özel stant hediyelidir.",
        description: "Canlı renkler, premium pürüzsüz yüzey ve kusursuz uyum. Çakmağınızı sımsıkı sarar, ergonomik tasarımıyla cebinize tam oturur.",
        image:"images/cakmaklık gorsel.jpeg"
    },
    {
        id: 2,
        name: "Anahtarlık",
        category: "Anahtarlıklar",
        price: "₺35.00",
        wholesaleNote: "50 ürün ve üzeri stant siparişlerinde kurumsal logo eklenebilir.",
        description: "Kasa yanın yeni parlayan yıldızınız olacak",
        image: "images/anahtarlık.jpeg"
    },
    {
        id: 3,
        name: "Mekanik Tuş Clickerlar",
        category: "Clickerlar",
        price: "₺60.00",
        wholesaleNote: "10'lu ve 20'li toptan kutularda perakende noktaları için avantajlı fiyat.",
        description: "Gerçek mekanik klavye switch'i kullanılarak üretilmiş, stres atmaya birebir fidget oyuncak. Harika tok bir ses çıkarır.",
        image: "images/clicker.png"
    }
];

// WhatsApp Numarası (Kendi numaranla değiştir - Başında 90 olacak)
const PHONE_NUMBER = "905551911414";

// Slider Mantığı
// Slider Verileri (Artık her yazının bir arka plan görseli var)
const slides = [
    { 
        title: "Yeni Sezon Çakmak Kılıfları", 
        desc: "Toptan siparişlerde stant bedava!",
        // Kendi görselini koyabilirsin: "images/slider-1.jpg"
        img:  "images/cakmaklık gorsel.jpeg"
    },
    { 
        title: "Stres Atıcı Clickerlar", 
        desc: "Mekanik hissiyle bağımlılık yapar.",
        // Kendi görselini koyabilirsin: "images/slider-2.jpg"
        img: "images/clicker.png"
    }
];

let currentSlide = 0;

function updateSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const sliderContent = document.getElementById('sliderContent');

    // Arka plan fotoğrafını ve üzerine okunabilirliği artıran hafif koyu filtreyi uygula
    sliderContainer.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${slides[currentSlide].img}')`;

    // İçeriği güncelle
    sliderContent.innerHTML = `
        <h2>${slides[currentSlide].title}</h2>
        <p>${slides[currentSlide].desc}</p>
    `;
    
    currentSlide = (currentSlide + 1) % slides.length;
}

setInterval(updateSlider, 4000);
updateSlider(); // İlk yüklemede çalıştır

// Ürünleri Ekrana Çizme
function renderProducts() {
    const container = document.getElementById('productShowcase');
    
    // Kategorileri belirle (Set ile benzersiz olanları al)
    const categories = [...new Set(products.map(p => p.category))];
    
    let html = '';
    categories.forEach(category => {
        const catProducts = products.filter(p => p.category === category);
        
        // CSS ID'si için Türkçe karakterleri temizle (örn: Çakmak Kılıfları -> cakmak-kiliflari)
        const catId = category.toLowerCase().replace(/ /g, '-').replace(/ç/g, 'c').replace(/ı/g, 'i');
        
        html += `
            <section id="${catId}" class="category-section">
                <h2 class="category-title">${category}</h2>
                <div class="grid">
                    ${catProducts.map(product => `
                        <div class="card">
                            <img src="${product.image}" alt="${product.name}" class="card-img" loading="lazy">
                            <div class="card-body">
                                <span class="card-tag">${product.category}</span>
                                <h3 class="card-title">${product.name}</h3>
                                <p class="card-desc">${product.description}</p>
                                <div style="margin-top: auto;">
                                    <button class="btn-secondary" onclick="openModal(${product.id})">Detayları İncele</button>
                                    <a href="https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent('Merhaba, ' + product.name + ' ürünü için toptan/stant siparişi hakkında bilgi almak istiyorum.')}" target="_blank" class="btn-primary">Sipariş Ver</a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    });
    
    container.innerHTML = html;
}

// Modal (Detay Ekranı) İşlemleri
const modal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');

function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if(!product) return;

    const wpMessage = `Merhaba, ${product.name} ürünü için toptan/stant siparişi hakkında bilgi almak istiyorum.`;
    
    // Modelleri alt alta dizeceğimiz HTML'i hazırlayalım
    let stackedImagesHTML = '';
    
    // Eğer ekstra model fotoğrafları varsa hepsini alt alta koy
    if (product.models && product.models.length > 0) {
        stackedImagesHTML = product.models.map(model => `
            <div class="stacked-image-wrapper">
                <img src="${model.img}" loading="lazy" alt="${model.name}" class="stacked-image">
                <div class="model-title">${model.name}</div>
            </div>
        `).join('');
    } else {
        // Ekstra model yoksa sadece ana resmi koy
        stackedImagesHTML = `
            <div class="stacked-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="stacked-image">
            </div>
        `;
    }
    
    // modalBody içine "Kayan Alan" ve "Sabit Alan" olarak iki parça basıyoruz
    modalBody.innerHTML = `
        <!-- Kaydırılabilir İçerik Alanı -->
        <div class="modal-scroll-area">
            <span class="card-tag">${product.category}</span>
            <h2 class="card-title" style="font-size: 24px; margin-bottom: 8px;">${product.name}</h2>
            
            <div class="wholesale-box">
                <strong>Toptan Fırsatı</strong>
                ${product.wholesaleNote}
            </div>
            
            <p style="color: #57534e; line-height: 1.5; margin-bottom: 24px;">${product.description}</p>
            
            <h3 style="font-size: 16px; margin-bottom: 12px; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Renk ve Modeller</h3>
            
            <!-- Resimler burada alt alta listelenecek -->
            <div class="models-list">
                ${stackedImagesHTML}
            </div>
        </div>

        <!-- Sabit Sipariş Alanı (En altta yapışık kalır) -->
        <div class="modal-footer-fixed">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #78716c;">Perakende Fiyatı:</span>
                <span class="modal-price" style="margin: 0;">${product.price}</span>
            </div>
            
            <a href="https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(wpMessage)}" target="_blank" class="btn-primary" style="padding: 16px; font-size: 16px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                WhatsApp'tan Sipariş Ver
            </a>
        </div>
    `;

    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Scrollu geri aç
    }, 300); // CSS transition süresi ile aynı
}

// Modalin dışına tıklayınca kapatma
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Sayfa yüklendiğinde ürünleri oluştur
renderProducts();