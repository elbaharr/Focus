// Default Products Data
const defaultProducts = [
    {
        id: "fog-1610",
        name: "Focus FOG 1610",
        category: "co2",
        price: "اتصل للسعر",
        image: "../../images/logo.png",
        description: "ماكينة CO2 قوية للمصانع الكبرى. مساحة عمل كبيرة وقدرة قص عالية.",
        specs: {
            power: "150 وات",
            area: "160x100 سم"
        }
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
            source: "Raycus"
        }
    },
    {
        id: "welding-1500",
        name: "ماكينة لحام ليزر",
        category: "welding",
        price: "اتصل للسعر",
        image: "../../images/logo.png",
        description: "تكنولوجيا اللحام الأحدث والأسرع. نتائج نظيفة بدون تشطيب.",
        specs: {
            power: "1500 وات"
        }
    }
];

// Initialize products in localStorage if empty
function initializeProducts() {
    const storedProducts = localStorage.getItem('products');
    try {
        if (!storedProducts) {
            localStorage.setItem('products', JSON.stringify(defaultProducts));
        } else {
            const parsed = JSON.parse(storedProducts);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                localStorage.setItem('products', JSON.stringify(defaultProducts));
            }
        }
    } catch (e) {
        console.error('Error initializing products:', e);
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
}

// Load products from localStorage
function loadProducts() {
    try {
        const stored = localStorage.getItem('products');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Error loading products:', e);
    }
    return defaultProducts;
}

let products = loadProducts();
let filteredProducts = [...products];
let activeFilters = [];

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Catalog page loaded');
    initializeProducts();
    products = loadProducts();
    console.log('Products loaded:', products.length);
    
    filterProducts();
    renderProducts();
    setupSort();
    
    // Listen for storage changes (when products are updated in dashboard)
    window.addEventListener('storage', function(e) {
        if (e.key === 'products') {
            products = loadProducts();
            filterProducts();
            renderProducts();
        }
    });
});

function setupFilters() {}

function filterProducts() {
    filteredProducts = [...products];
    updateProductCount();
}

function setupSort() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        
        // Reload products
        products = loadProducts();
        filteredProducts = products;
        
        if (sortValue === 'name') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        }
        
        renderProducts();
    });
}

function renderProducts() {
    const container = document.getElementById('products-container');
    const countElement = document.getElementById('products-count');
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-box-open text-secondary" style="font-size: 4rem;"></i>
                <p class="text-secondary mt-3">لا توجد منتجات متاحة</p>
            </div>
        `;
        countElement.textContent = 'لا توجد منتجات';
        return;
    }
    
    countElement.textContent = `عرض ${filteredProducts.length} منتج`;
    
    container.innerHTML = filteredProducts.map((product, index) => {
        // Generate unique ID for this instance
        const instanceId = `product-${index}`;
        return `
        <div class="col-md-6 col-lg-4">
            <div class="product-card" id="${instanceId}">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='../../images/logo.png'">
                <div class="product-card-body">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-description">${product.description}</p>
                    <div class="product-specs">
                        ${product.specs && Object.entries(product.specs).length > 0 ? Object.entries(product.specs).map(([key, value]) => `
                            <div class="product-spec">
                                <i class="fa-solid fa-bolt"></i>
                                <span>${value}</span>
                            </div>
                        `).join('') : '<div class="product-spec text-warning"><small>بلا مواصفات</small></div>'}
                    </div>
                    <div class="product-footer">
                        <a href="https://wa.me/201127594310?text=${encodeURIComponent('مرحبا، استفسار بخصوص سعر: ' + product.name)}" target="_blank" class="btn btn-sm btn-gold text-dark fw-bold">
                            <i class="fa-brands fa-whatsapp me-1"></i> ${product.price}
                        </a>
                        <button class="btn btn-sm btn-outline-gold" onclick="viewProductDetails('${product.id}')">
                            <i class="fa-solid fa-eye me-1"></i> التفاصيل
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
}

function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if Swal is available
    if (typeof Swal !== 'undefined') {
        const specsHtml = product.specs ? Object.entries(product.specs).map(([key, value]) => 
            `<div class="mb-2"><strong>${key}:</strong> ${value}</div>`
        ).join('') : '';

        Swal.fire({
            title: `<h3 class="text-gold">${product.name}</h3>`,
            html: `
                <div class="text-start">
                    <img src="${product.image}" class="img-fluid rounded mb-3" style="max-height: 200px; display: block; margin: 0 auto;" onerror="this.src='../../images/logo.png'">
                    <p class="text-white">${product.description}</p>
                    <div class="bg-dark p-3 rounded border border-secondary mt-3">
                        <h6 class="text-gold mb-2 border-bottom border-secondary pb-2">المواصفات:</h6>
                        <div class="text-light small">
                            ${specsHtml || 'لا توجد مواصفات إضافية'}
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <a href="https://wa.me/201127594310?text=${encodeURIComponent('مرحبا، استفسار بخصوص سعر: ' + product.name)}" target="_blank" class="btn btn-gold text-dark fw-bold">
                            <i class="fa-brands fa-whatsapp me-1"></i> ${product.price}
                        </a>
                    </div>
                </div>
            `,
            background: '#1a1a2e',
            color: '#fff',
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                popup: 'glass-card border-gold'
            }
        });
    } else {
        alert(product.name + '\n' + product.description);
    }
}

function clearFilters() {
    filterProducts();
    document.getElementById('sort-select').value = 'default';
}
