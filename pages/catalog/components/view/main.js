// Default products
const defaultProducts = [
    {
        id: "fog-1610",
        name: "Focus FOG 1610",
        category: "co2",
        price: "اتصل للسعر",
        image: "../../../../images/logo.png",
        description: "ماكينة CO2 قوية للمصانع الكبرى."
    }
];

// Initialize products in localStorage if empty
function initializeProducts() {
    const stored = localStorage.getItem('products');
    if (!stored || JSON.parse(stored).length === 0) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
}

// Load products from localStorage
function loadProducts() {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : defaultProducts;
}

let products = [];
let editingProductId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    products = loadProducts();
    renderProducts();
});

function renderProducts() {
    const tbody = document.getElementById('productsTable');
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-secondary py-4">
                    لا توجد منتجات. اضغط على "إضافة منتج جديد" للبدء.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td class="text-white">${product.name}</td>
            <td class="text-gold">${product.price}</td>
            <td>
                <button class="btn btn-sm btn-outline-gold me-2" onclick="editProduct('${product.id}')">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function saveProduct() {
    const form = document.getElementById('productForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Reload products to ensure we have latest data
    products = loadProducts();
    
    const productData = {
        id: editingProductId || 'product-' + Date.now(),
        name: document.getElementById('productName').value,
        price: document.getElementById('productPrice').value,
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value
    };
    
    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = productData;
        }
    } else {
        products.push(productData);
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
    
    form.reset();
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'إضافة منتج جديد';
    
    renderProducts();
    
    // Show success message
    Swal.fire({
        icon: 'success',
        title: 'تم الحفظ بنجاح!',
        text: 'تم حفظ المنتج بنجاح.',
        confirmButtonText: 'موافق',
        confirmButtonColor: '#ec9c04',
        timer: 2000,
        timerProgressBar: true
    });
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('modalTitle').textContent = 'تعديل المنتج';
    
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

function deleteProduct(id) {
    Swal.fire({
        icon: 'warning',
        title: 'هل أنت متأكد؟',
        text: 'هل أنت متأكد من حذف هذا المنتج؟ لن يمكنك التراجع عن هذا الإجراء.',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            products = loadProducts(); // Reload to ensure latest data
            products = products.filter(p => p.id !== id);
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts();
            Swal.fire({
                icon: 'success',
                title: 'تم الحذف!',
                text: 'تم حذف المنتج بنجاح.',
                confirmButtonText: 'موافق',
                confirmButtonColor: '#ec9c04',
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
}

// Reset form when modal is closed
document.getElementById('addProductModal').addEventListener('hidden.bs.modal', function() {
    document.getElementById('productForm').reset();
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'إضافة منتج جديد';
});

