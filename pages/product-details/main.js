// Load products from localStorage
function loadProducts() {
    const stored = localStorage.getItem('products');
    if (stored) {
        return JSON.parse(stored);
    }
    // Default products if localStorage is empty
    return [
        {
            id: "fog-1610",
            name: "Focus FOG 1610",
            category: "co2",
            price: "اتصل للسعر",
            image: "../../images/logo.png",
            description: "ماكينة CO2 قوية للمصانع الكبرى. مساحة عمل كبيرة وقدرة قص عالية.",
            specs: {
                power: "150 وات",
                area: "160x100 سم",
                speed: "0-600 ملم/ثانية",
                accuracy: "±0.02 ملم"
            },
            videoId: "dQw4w9WgXcQ"
        },
        {
            id: "fiber-30w",
            name: "Fiber Marker 30W",
            category: "fiber",
            price: "اتصل للسعر",
            image: "../../images/logo.png",
            description: "الحل المثالي للحفر الدقيق على المعادن والذهب والإكسسوارات.",
            specs: {
                power: "30 وات",
                source: "Raycus",
                wavelength: "1064 نانومتر"
            },
            videoId: "dQw4w9WgXcQ"
        },
        {
            id: "welding-1500",
            name: "ماكينة لحام ليزر",
            category: "welding",
            price: "اتصل للسعر",
            image: "../../images/logo.png",
            description: "تكنولوجيا اللحام الأحدث والأسرع. نتائج نظيفة بدون تشطيب.",
            specs: {
                power: "1500 وات",
                thickness: "حتى 3 ملم"
            },
            videoId: "dQw4w9WgXcQ"
        }
    ];
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        const products = loadProducts();
        const product = products.find(p => p.id === productId);
        if (product) {
            renderProduct(product);
        } else {
            renderNotFound();
        }
    } else {
        renderNotFound();
    }
});

function renderProduct(product) {
    const container = document.getElementById('product-container');
    
    container.innerHTML = `
        <div class="row g-4">
            <div class="col-lg-5">
                <div class="product-image-wrapper glass-card p-4">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid rounded-3">
                </div>
                ${product.videoId ? `
                    <div class="product-video mt-4 glass-card p-4">
                        <h5 class="text-white mb-3"><i class="fa-solid fa-play-circle me-2 text-gold"></i>فيديو توضيحي</h5>
                        <div class="ratio ratio-16x9 rounded-3 overflow-hidden">
                            <iframe src="https://www.youtube.com/embed/${product.videoId}" allowfullscreen></iframe>
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="col-lg-7">
                <div class="product-info">
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <span class="text-secondary"><i class="fa-solid fa-tag me-1"></i> ${product.id}</span>
                    </div>
                    <h1 class="text-white mb-3 display-5">${product.name}</h1>
                    <p class="text-beige lead mb-4" style="line-height: 1.8;">${product.description}</p>
                    
                    <div class="product-price-section glass-card p-4 mb-4">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <small class="text-secondary d-block mb-1">السعر</small>
                                <h2 class="text-gold mb-0">${product.price}</h2>
                            </div>
                            <i class="fa-solid fa-dollar-sign text-gold" style="font-size: 3rem; opacity: 0.2;"></i>
                        </div>
                    </div>
                    
                    <div class="product-specs glass-card p-4 mb-4">
                        <h5 class="text-white mb-4"><i class="fa-solid fa-list-check me-2 text-gold"></i>المواصفات الفنية</h5>
                        <div class="row g-3">
                            ${Object.entries(product.specs).map(([key, value]) => `
                                <div class="col-md-6">
                                    <div class="spec-item d-flex align-items-center p-3 rounded-3" style="background: rgba(255,255,255,0.03);">
                                        <i class="fa-solid fa-check-circle text-gold me-3"></i>
                                        <div>
                                            <small class="text-secondary d-block">${getSpecLabel(key)}</small>
                                            <strong class="text-white">${value}</strong>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <div class="row g-3">
                            <div class="col-md-8">
                                <a href="../contact-us/page.html" class="btn btn-gold btn-lg w-100 py-3">
                                    <i class="fa-solid fa-phone me-2"></i> اتصل للاستفسار
                                </a>
                            </div>
                            <div class="col-md-4">
                                <a href="https://wa.me/201000124415" class="btn btn-outline-gold btn-lg w-100 py-3" target="_blank">
                                    <i class="fa-brands fa-whatsapp me-2"></i> واتساب
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update page title
    document.title = `${product.name} - Focus Laser`;
}

function getSpecLabel(key) {
    const labels = {
        'power': 'القدرة',
        'area': 'مساحة العمل',
        'speed': 'السرعة',
        'accuracy': 'الدقة',
        'source': 'المصدر',
        'wavelength': 'الطول الموجي',
        'thickness': 'سمك القطع'
    };
    return labels[key] || key;
}

function renderNotFound() {
    const container = document.getElementById('product-container');
    container.innerHTML = `
        <div class="text-center py-5">
            <i class="fa-solid fa-box-open text-secondary" style="font-size: 4rem;"></i>
            <h3 class="text-white mt-3">المنتج غير موجود</h3>
            <p class="text-secondary">المنتج الذي تبحث عنه غير متوفر</p>
            <a href="../catalog/page.html" class="btn btn-gold mt-3">العودة للكتالوج</a>
        </div>
    `;
}
