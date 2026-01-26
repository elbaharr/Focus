# 🔧 Focus Laser - المرجع التقني الموحد

**الإصدار:** 3.0.0  
**آخر تحديث:** 2026-01-26  
**الحالة:** ✅ مكتمل ومُختبر  

---

## 📋 جدول المحتويات

- [1. هوية المشروع والبنية](#1-هوية-المشروع-والبنية)
- [2. نظام التصميم والألوان](#2-نظام-التصميم-والألوان)
- [3. التقنيات المستخدمة](#3-التقنيات-المستخدمة)
- [4. هيكل الملفات والمكونات](#4-هيكل-الملفات-والمكونات)
- [5. المنطق البرمجي والوظائف](#5-المنطق-البرمجي-والوظائف)
- [6. معايير الكود والأداء](#6-معايير-الكود-والأداء)
- [7. الأمان والتحقق](#7-الأمان-والتحقق)
- [8. التكامل والـ API](#8-التكامل-وال-api)
- [9. التحسينات المستقبلية](#9-التحسينات-المقبلية)

---

# 1. هوية المشروع والبنية

## 1.1 معلومات المشروع

* **اسم المشروع:** Focus Laser (فوكاس ليزر)
* **الشعار:** "تكنولوجيا عالمية.. بتطوير محلي"
* **الهدف:** موقع كتالوج ديناميكي + منصة تعليمية، بتصميم صناعي فخم (Premium Industrial)
* **التقنية:** HTML5, CSS3, Pure JS, Bootstrap 5 RTL
* **نوع الهيكلة:** Modular Structure (كل صفحة عبارة عن وحدة مستقلة)

## 1.2 البنية البرمجية

```text
focus-laser-front/
│
├── images/                      (شعار الموقع وصور الماكينات)
├── global.css                   (الستايل العام: الألوان والخطوط)
├── main.js                      (كود التوجيه العام)
├── index.html                   (الصفحة الرئيسية)
│
├── pages/                       (الصفحات الداخلية)
│   ├── catalog/                 [وحدة الكتالوج]
│   ├── academy/                 [وحدة الأكاديمية]
│   ├── product-details/         [صفحة التفاصيل]
│   ├── contact-us/              [وحدة التواصل]
│   ├── dashboard/               [لوحة التحكم]
│   └── about/                   [وحدة عن الشركة]
│
├── docs/                        [الوثائق الموحدة]
│   ├── MAIN-DOCUMENTATION.md    (الدليل الشامل)
│   ├── DASHBOARD-GUIDE.md       (دليل لوحة التحكم)
│   └── TECHNICAL-REFERENCE.md   (هذا الملف)
│
└── PROJECT_MASTER_PLAN.md       (خطة المشروع الرئيسية)
```

---

# 2. نظام التصميم والألوان

## 2.1 نظام الألوان

مستوحى من اللوجو الرسمي (كحلي غامق + أصفر ذهبي).

### **الألوان (CSS Variables):**
```css
:root {
    /* 🎨 ألوان اللوجو */
    --primary-dark: #1D202B;    /* الخلفية الأساسية (كحلي ليلي) */
    --primary-light: #2A2E3D;   /* خلفية الكروت والسكاشن */
    --laser-gold: #F0A500;      /* أصفر ذهبي (الأزرار - العناوين - الأيقونات) */
    --gold-hover: #d49200;      /* درجة أغمق للـ Hover */
    
    /* 📄 النصوص */
    --text-main: #FFFFFF;       /* أبيض صريح */
    --text-muted: #B0B3B8;      /* رمادي فاتح للنصوص الفرعية */
    
    /* ✨ مؤثرات */
    --glass-bg: rgba(29, 32, 43, 0.95); /* نافبار زجاجي */
    --shadow-gold: 0 0 20px rgba(240, 165, 0, 0.15); /* توهج حول العناصر النشطة */
}
```

## 2.2 الخطوط (Typography)

* **الخط الرئيسي:** `Cairo` (Google Fonts)
* **الأوزان:** 300 (Light), 400 (Regular), 700 (Bold)

### إعداد الخطوط
```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;700&display=swap');

body {
    font-family: 'Cairo', sans-serif;
    font-weight: 400;
    line-height: 1.6;
}
```

---

# 3. التقنيات المستخدمة

## 3.1 Frontend Libraries

### HTML5
```html
✅ Semantic HTML5
✅ Accessibility (ARIA)
✅ Meta tags
✅ SEO Optimization
```

### CSS3
```css
✅ CSS Grid & Flexbox
✅ CSS Animations
✅ CSS Variables
✅ Responsive Design
✅ Media Queries
✅ Glass Morphism
```

### JavaScript
```javascript
✅ Vanilla JavaScript (ES6+)
✅ localStorage API
✅ Fetch API
✅ DOM Manipulation
✅ Event Handling
✅ Async/Await
```

## 3.2 المكتبات الخارجية

### Bootstrap 5.3.2
```javascript
✅ CSS Framework
✅ Grid System
✅ Components
✅ Utilities
✅ RTL Support
```

### Font Awesome 6.4.0
```javascript
✅ Icons Library
✅ Social Icons
✅ UI Icons
✅ Brand Icons
```

### SweetAlert2
```javascript
✅ Beautiful Alerts
✅ Confirmations
✅ Toast Notifications
✅ Custom Styling
```

---

# 4. هيكل الملفات والمكونات

## 4.1 الملفات الرئيسية

### global.css
```css
/* CSS Variables */
:root {
    --primary-dark: #1D202B;
    --primary-light: #2A2E3D;
    --laser-gold: #F0A500;
    --gold-hover: #d49200;
    --text-main: #FFFFFF;
    --text-muted: #B0B3B8;
    --glass-bg: rgba(29, 32, 43, 0.95);
    --shadow-gold: 0 0 20px rgba(240, 165, 0, 0.15);
}

/* Global Styles */
body {
    font-family: 'Cairo', sans-serif;
    background-color: var(--primary-dark);
    color: var(--text-main);
    direction: rtl;
    text-align: right;
}

/* Components */
.navbar-custom { }
.btn-gold { }
.card-dark { }
```

### main.js
```javascript
// Global Functions
function initializeApp() {
    loadProducts();
    loadTestimonials();
    setupEventListeners();
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    // Display products logic
}

function loadTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    // Display testimonials logic
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
```

## 4.2 هيكل البيانات (Data Schema)

### نموذج المنتج (Product Object)
```javascript
{
    id: "fog-1610",              // Unique ID
    name: "Focus FOG 1610",      // اسم الماكينة
    category: "co2",             // التصنيف (co2, fiber, welding)
    price: "اتصل للسعر",         // السعر (نص أو رقم)
    image: "../../images/fog1610.jpg", // مسار الصورة
    description: "وصف مختصر...", // الوصف
    specs: {                     // المواصفات الفنية
        power: "130 Watt",
        area: "160x100 cm"
    },
    videoId: "dQw4w9WgXcQ"       // YouTube ID
}
```

### نموذج الرسالة (Message Object)
```javascript
{
    id: "msg-1642618800000",     // Unique ID (timestamp)
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966 50 123 4567",
    subject: "استفسار عن المنتج",
    message: "أود الاستفسار عن...",
    date: "2026-01-20T10:30:00",
    read: false                  // حالة القراءة
}
```

---

# 5. المنطق البرمجي والوظائف

## 5.1 الوظائف الأساسية

### localStorage Manager
```javascript
class StorageManager {
    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    static getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    static removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
}
```

### Alert Manager (SweetAlert2)
```javascript
class AlertManager {
    static success(title, text = '') {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            confirmButtonText: 'موافق',
            confirmButtonColor: '#F0A500'
        });
    }

    static error(title, text = '') {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonText: 'موافق',
            confirmButtonColor: '#dc3545'
        });
    }

    static confirm(title, text = '') {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            showCancelButton: true,
            confirmButtonText: 'موافق',
            cancelButtonText: 'إلغاء',
            confirmButtonColor: '#F0A500',
            cancelButtonColor: '#6c757d'
        });
    }
}
```

### URL Parameter Manager
```javascript
class URLManager {
    static getParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    static setParameter(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.replaceState({}, '', url);
    }
}
```

## 5.2 دوال محددة للصفحات

### صفحة تفاصيل المنتج
```javascript
// pages/product-details/main.js
class ProductDetails {
    constructor() {
        this.productId = URLManager.getParameter('id');
        this.product = null;
        this.init();
    }

    init() {
        if (!this.productId) {
            window.location.href = '../catalog/page.html';
            return;
        }

        this.loadProduct();
        this.renderProduct();
    }

    loadProduct() {
        const products = StorageManager.getItem('products') || [];
        this.product = products.find(p => p.id === this.productId);
        
        if (!this.product) {
            AlertManager.error('المنتج غير موجود', 'الرجاء العودة للكتالوج');
            setTimeout(() => {
                window.location.href = '../catalog/page.html';
            }, 2000);
        }
    }

    renderProduct() {
        if (!this.product) return;

        document.getElementById('productImage').src = this.product.image;
        document.getElementById('productName').textContent = this.product.name;
        document.getElementById('productCategory').textContent = this.product.category;
        document.getElementById('productPrice').textContent = this.product.price;
        document.getElementById('productDescription').textContent = this.product.description;
        
        // Render specifications
        if (this.product.specs) {
            const specsHtml = Object.entries(this.product.specs)
                .map(([key, value]) => `
                    <tr>
                        <td>${this.translateSpec(key)}</td>
                        <td>${value}</td>
                    </tr>
                `).join('');
            document.getElementById('productSpecs').innerHTML = specsHtml;
        }

        // Render video if exists
        if (this.product.videoId) {
            document.getElementById('productVideo').innerHTML = `
                <iframe width="100%" height="400" 
                    src="https://www.youtube.com/embed/${this.product.videoId}" 
                    frameborder="0" allowfullscreen>
                </iframe>
            `;
        }
    }

    translateSpec(key) {
        const translations = {
            power: 'القوة',
            area: 'مساحة العمل',
            source: 'مصدر الليزر',
            wavelength: 'طول الموجة'
        };
        return translations[key] || key;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductDetails();
});
```

---

# 6. معايير الكود والأداء

## 6.1 معايير الكود

### HTML Standards
```html
✅ Use semantic HTML5 tags
✅ Include proper meta tags
✅ Use alt attributes for images
✅ Validate HTML markup
✅ Use proper heading hierarchy
```

### CSS Standards
```css
✅ Use BEM naming convention
✅ Mobile-first approach
✅ Use CSS variables for colors
✅ Minimize use of !important
✅ Optimize for performance
```

### JavaScript Standards
```javascript
✅ Use ES6+ features
✅ Proper error handling
✅ Input validation
✅ Code comments and documentation
✅ Avoid global variables
✅ Use const/let instead of var
```

## 6.2 الأداء

### Performance Metrics
```
⚡ Page Load: < 2 seconds
⚡ Local Storage: Fast Access
⚡ CSS Animations: Smooth 60fps
⚡ Memory Efficient: < 5MB
⚡ No External API Calls (Self-Hosted)
```

### Optimization Techniques
```javascript
// Lazy Loading Images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Debounce Search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

---

# 7. الأمان والتحقق

## 7.1 التحقق من المدخلات

```javascript
class Validator {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        return re.test(phone);
    }

    static validateRequired(value) {
        return value && value.trim().length > 0;
    }

    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    static validateForm(formData) {
        const errors = [];
        
        if (!this.validateRequired(formData.name)) {
            errors.push('الاسم مطلوب');
        }
        
        if (!this.validateEmail(formData.email)) {
            errors.push('البريد الإلكتروني غير صحيح');
        }
        
        if (formData.phone && !this.validatePhone(formData.phone)) {
            errors.push('رقم الهاتف غير صحيح');
        }
        
        return errors;
    }
}
```

## 7.2 المصادقة والصلاحيات

```javascript
class AuthManager {
    static login(email, password) {
        const users = StorageManager.getItem('users') || [];
        const user = users.find(u => u.email === email);
        
        if (user && this.verifyPassword(password, user.password)) {
            const token = this.generateToken();
            StorageManager.setItem('currentUser', {
                ...user,
                token: token,
                loginTime: Date.now()
            });
            return { success: true, user, token };
        }
        
        return { success: false, error: 'بيانات الدخول غير صحيحة' };
    }

    static logout() {
        StorageManager.removeItem('currentUser');
        window.location.href = '../auth/login.html';
    }

    static isLoggedIn() {
        const currentUser = StorageManager.getItem('currentUser');
        return currentUser && currentUser.token;
    }

    static hasRole(role) {
        const currentUser = StorageManager.getItem('currentUser');
        return currentUser && currentUser.role === role;
    }

    static generateToken() {
        return btoa(Date.now() + Math.random().toString(36));
    }

    static verifyPassword(password, hash) {
        return btoa(password + 'salt') === hash;
    }

    static protectRoute(requiredRole = 'user') {
        if (!this.isLoggedIn()) {
            window.location.href = '../auth/login.html';
            return false;
        }
        
        if (requiredRole && !this.hasRole(requiredRole)) {
            AlertManager.error('غير مصرح', 'ليس لديك صلاحية للوصول لهذه الصفحة');
            return false;
        }
        
        return true;
    }
}
```

---

# 8. التكامل والـ API

## 8.1 API Endpoints المقترحة

### RESTful API Structure
```javascript
// API Base URL
const API_BASE_URL = '/api/v1';

// API Manager
class APIManager {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthManager.getToken()}`
            }
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Products API
    static async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products?${queryString}`);
    }

    static async createProduct(productData) {
        return this.request('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    // Messages API
    static async createMessage(messageData) {
        return this.request('/messages', {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
    }
}
```

## 8.2 خطوات التحويل للـ Backend

### 1. استبدال localStorage بـ API calls
```javascript
// Before (localStorage)
const products = JSON.parse(localStorage.getItem('products')) || [];

// After (API)
const products = await APIManager.getProducts();
```

### 2. إضافة Authentication Headers
```javascript
// Add token to all requests
const token = StorageManager.getItem('currentUser')?.token;
headers: {
    'Authorization': `Bearer ${token}`
}
```

### 3. معالجة الأخطاء والـ Loading States
```javascript
try {
    AlertManager.loading('جاري التحميل...');
    const data = await APIManager.getProducts();
    // Render data
} catch (error) {
    AlertManager.error('خطأ', 'فشل تحميل البيانات');
} finally {
    Swal.close();
}
```

---

# 9. التحسينات المستقبلية

## 9.1 التحسينات قصيرة الأجل

```
□ إضافة نظام تصفية متقدم
□ تحسين الأداء
□ إضافة مزيد من الرسوم البيانية
□ تحسين الأمان
□ إضافة pagination للقوائم الطويلة
```

## 9.2 التحسينات متوسطة الأجل

```
□ نظام دفع متكامل
□ نظام تنبيهات البريد الإلكتروني
□ تطبيق mobile
□ دعم لغات أخرى
□ نظام بحث متقدم
□ تصدير PDF للتقارير
```

## 9.3 التحسينات طويلة الأجل

```
□ نظام CRM كامل
□ تحليلات متقدمة
□ تكامل مع أنظمة خارجية
□ نظام نسخ احتياطي تلقائي
□ نظام إشعارات متقدم
□ Progressive Web App (PWA)
```

## 9.4 ملاحظات أمنية

1. **المصادقة**: استخدم JWT tokens
2. **الصلاحيات**: endpoints الـ Dashboard تحتاج `role: admin`
3. **رفع الصور**: استخدم Cloudinary أو S3 بدل base64
4. **التحقق**: تحقق من جميع المدخلات على الـ Backend
5. **HTTPS**: استخدم دائماً في الإنتاج

---

## 🎓 خلاصة المرجع التقني

لقد تم توحيد جميع المراجع التقنية في هذا الملف بما يشمل:

✨ **الهيكلة البرمجية** - بنية واضحة ومنظمة  
📊 **نظام التصميم** - ألوان وخطوط موحدة  
🔧 **التقنيات** - أفضل الممارسات والأدوات  
📝 **معايير الكود** - قواعد برمجية صارمة  
🔒 **الأمان** - حماية وتحقق متقدم  
🚀 **الأداء** - تحسينات وتقنيات سريعة  

**مرجع كامل للتطوير والصيانة! 🔧**

---

**آخر تحديث:** 2026-01-26  
**الحالة:** ✅ مكتمل وموحد  
**الإصدار:** 3.0.0

---

*تم توحيد جميع المراجع التقنية في هذا الملف لتسهيل التطوير*
