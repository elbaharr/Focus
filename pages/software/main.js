// Default Software Data
const defaultProducts = [
    {
        id: "control-system",
        name: "برنامج التحكم الرئيسي",
        category: "control",
        version: "v3.5",
        price: "مدرج",
        image: "../../images/logo.png",
        description: "برنامج التحكم الشامل لماكينات الليزر",
        specs: {
            platform: "Windows / Mac",
            system: "دعم كامل للماكينات",
            updates: "تحديثات مستمرة"
        }
    },
    {
        id: "design-software",
        name: "برنامج التصميم والنقش",
        category: "design",
        version: "v2.8",
        price: "مدرج",
        image: "../../images/logo.png",
        description: "برنامج تصميم متقدم للنقش والقطع",
        specs: {
            compatible: "متوافق مع Adobe",
            features: "ميزات متقدمة",
            support: "دعم فني شامل"
        }
    },
    {
        id: "management-app",
        name: "برنامج إدارة المعاملات",
        category: "management",
        version: "v1.2",
        price: "مدرج",
        image: "../../images/logo.png",
        description: "إدارة كاملة للطلبات والمخزون",
        specs: {
            database: "قاعدة بيانات قوية",
            reports: "تقارير شاملة",
            integration: "تكامل مع أنظمة أخرى"
        }
    },
    {
        id: "maintenance-tool",
        name: "برنامج الصيانة والتشخيص",
        category: "control",
        version: "v2.0",
        price: "مجاني",
        image: "../../images/logo.png",
        description: "تشخيص سريع لمشاكل الماكينة",
        specs: {
            diagnostic: "تشخيص ذكي",
            monitoring: "مراقبة مستمرة",
            alerts: "تنبيهات فورية"
        }
    },
    {
        id: "mobile-app",
        name: "تطبيق الهاتف الذكي",
        category: "mobile",
        version: "v1.5",
        price: "مجاني",
        image: "../../images/logo.png",
        description: "تطبيق للتحكم والمراقبة من الهاتف",
        specs: {
            platforms: "iOS / Android",
            remote: "تحكم عن بُعد",
            notifications: "إشعارات فورية"
        }
    },
    {
        id: "cloud-sync",
        name: "السحابة والمزامنة",
        category: "management",
        version: "v1.0",
        price: "اشتراك",
        image: "../../images/logo.png",
        description: "مزامنة البيانات عبر السحابة",
        specs: {
            cloud: "تخزين آمن",
            sync: "مزامنة تلقائية",
            backup: "نسخ احتياطي دوري"
        }
    }
];

let products = [...defaultProducts];
let filteredProducts = [...products];

document.addEventListener('DOMContentLoaded', function() {
    filterProducts();
    renderProducts();
    setupSort();
});

function filterProducts() {
    filteredProducts = [...products];
    updateProductCount();
}

function renderProducts() {
    const container = document.getElementById('products-container');
    
    if (!container) {
        console.error('Products container not found');
        return;
    }
    
    container.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6';
        
        card.innerHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="card-image">
                <div class="product-card-body">
                    <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 10px;">
                        <span style="background: #ec9c04; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">${product.version}</span>
                    </div>
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-description">${product.description}</p>
                    <div class="product-specs">
                        ${Object.values(product.specs).map(spec => `
                            <span class="product-spec">
                                <i class="fa-solid fa-check"></i> ${spec}
                            </span>
                        `).join('')}
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${product.price}</span>
                        <button class="btn-add-cart" onclick="downloadSoftware('${product.id}')">
                            <i class="fa-solid fa-download"></i> تحميل
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function setupSort() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            
            if (sortValue === 'name') {
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortValue === 'version') {
                filteredProducts.sort((a, b) => b.version.localeCompare(a.version));
            }
            
            renderProducts();
        });
    }
}

function updateProductCount() {
    const countElement = document.getElementById('products-count');
    if (countElement) {
        countElement.textContent = `عرض ${filteredProducts.length} من ${products.length} البرامج`;
    }
}

function downloadSoftware(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showNotification(`جاري تحميل ${product.name} الإصدار ${product.version}`);
    }
}

function showNotification(message) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'نجح!',
            text: message,
            icon: 'success',
            confirmButtonText: 'حسناً'
        });
    } else {
        alert(message);
    }
}

function addScrollAnimations() {
    const cards = document.querySelectorAll('.software-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => observer.observe(card));
}

// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals if needed
    }
});
