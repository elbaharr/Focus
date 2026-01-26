// Default Spare Parts Data
const defaultProducts = [
    {
        id: "lens-focus",
        name: "عدسة تركيز Focus",
        category: "lenses",
        price: "800 ريال",
        image: "../../images/logo.png",
        description: "عدسة عالية الجودة لتركيز الحزمة",
        specs: {
            diameter: "قطر: 25 ملم",
            quality: "تصنيع ياباني",
            accuracy: "دقة عالية جداً"
        }
    },
    {
        id: "mirror-45",
        name: "مرآة عاكسة 45°",
        category: "mirrors",
        price: "450 ريال",
        image: "../../images/logo.png",
        description: "مرآة معدنية بطلاء خاص عالي الانعكاس",
        specs: {
            size: "حجم: 50×50 ملم",
            coating: "طلاء ذهبي",
            duration: "عمر طويل"
        }
    },
    {
        id: "tube-150w",
        name: "أنبوب ليزر CO2 150W",
        category: "tubes",
        price: "2,500 ريال",
        image: "../../images/logo.png",
        description: "أنبوب قطع وحفر عالي الأداء",
        specs: {
            power: "قوة: 150 واط",
            length: "طول: 1250 ملم",
            duration: "عمر: 2000 ساعة"
        }
    },
    {
        id: "control-board",
        name: "لوحة تحكم Ruida",
        category: "electronics",
        price: "1,200 ريال",
        image: "../../images/logo.png",
        description: "لوحة تحكم ليزر متقدمة وموثوقة",
        specs: {
            version: "نسخة: Ruida RDC6442",
            easy: "سهلة الاستخدام",
            support: "دعم كامل"
        }
    },
    {
        id: "lens-protect",
        name: "عدسة حماية 20 ملم",
        category: "lenses",
        price: "350 ريال",
        image: "../../images/logo.png",
        description: "عدسة واقية من الرطوبة والغبار",
        specs: {
            diameter: "قطر: 20 ملم",
            protection: "حماية كاملة",
            replaceable: "قابلة للاستبدال"
        }
    },
    {
        id: "water-pump",
        name: "مضخة ماء تبريد",
        category: "tubes",
        price: "600 ريال",
        image: "../../images/logo.png",
        description: "مضخة قوية لتبريد أنبوب الليزر",
        specs: {
            power: "قدرة: 100W",
            flow: "تدفق: 600L/h",
            quiet: "هادئة وفعالة"
        }
    }
];

let products = [...defaultProducts];
let filteredProducts = [...products];

// Initialize from LocalStorage if available
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        const allProducts = JSON.parse(storedProducts);
        if (allProducts.length > 0) {
            products = allProducts;
            filteredProducts = [...products];
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
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
                <img src="${product.image}" alt="${product.name}" class="card-image" onerror="this.src='../../images/logo.png'">
                <div class="product-card-body">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-description">${product.description}</p>
                    <div class="product-specs">
                        ${product.specs ? Object.values(product.specs).map(spec => `
                            <span class="product-spec">
                                <i class="fa-solid fa-check"></i> ${spec}
                            </span>
                        `).join('') : ''}
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${product.price}</span>
                        <button class="btn-add-cart" onclick="viewProductDetails('${product.id}')">
                            <i class="fa-solid fa-eye"></i> التفاصيل
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if Swal is available
    if (typeof Swal !== 'undefined') {
        const specsHtml = product.specs ? Object.values(product.specs).map(spec => 
            `<div class="mb-2"><i class="fa-solid fa-check text-gold me-2"></i>${spec}</div>`
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
                        <span class="badge bg-gold text-dark fs-6">${product.price}</span>
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
    


// Smooth scroll
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
