// Global variables
let currentMessageId = null;
let currentProductId = null;
let currentVideoId = null;
let currentUserId = null;
let currentSparePartId = null;
let currentSoftwareId = null;
let productsData = [];
let videosData = [];
let messagesData = [];
let usersData = [];
let sparePartsData = [];
let softwareData = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        window.location.href = '../auth/login.html';
        return;
    }
    
    // Load user info
    const userEmail = localStorage.getItem('userEmail') || 'admin@focus-laser.com';
    document.getElementById('userEmail').textContent = userEmail;
    document.getElementById('userName').textContent = 'الإدمن';
    
    // Initialize all data
    loadAllData();
    updateLastUpdate();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update stats every 30 seconds
    setInterval(() => {
        loadAllData();
    }, 30000);
});

// Setup event listeners for sidebar toggle
function setupEventListeners() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.add('show');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('show');
        });
    }
    
    // Close sidebar when clicking on nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 991.98) {
                sidebar.classList.remove('show');
            }
        });
    });

    document.getElementById('markAllReadBtn')?.addEventListener('click', markAllMessagesRead);
}

// Load all data from localStorage
function loadAllData() {
    productsData = JSON.parse(localStorage.getItem('products')) || [];
    videosData = JSON.parse(localStorage.getItem('videos')) || [];
    messagesData = JSON.parse(localStorage.getItem('messages')) || [];
    usersData = JSON.parse(localStorage.getItem('users')) || [];
    sparePartsData = JSON.parse(localStorage.getItem('spareParts')) || [];
    softwareData = JSON.parse(localStorage.getItem('software')) || [];
    
    updateStats();
    loadRecentActivity();
    loadRecentVideos();
    updateUnreadBadge();
    updateLastUpdate();
}

// Update statistics
function updateStats() {
    document.getElementById('productsCount').textContent = productsData.length;
    document.getElementById('videosCount').textContent = videosData.length;
    document.getElementById('messagesCount').textContent = messagesData.length;
    
    const unreadCount = messagesData.filter(m => !m.read).length;
    document.getElementById('unreadMessagesCount').textContent = unreadCount;
    
    // Update spare parts and software counts if elements exist
    const sparePartsCount = document.getElementById('sparePartsCount');
    if (sparePartsCount) sparePartsCount.textContent = sparePartsData.length;
    
    const softwareCount = document.getElementById('softwareCount');
    if (softwareCount) softwareCount.textContent = softwareData.length;
}

// Load recent activity
function loadRecentActivity() {
    const recentMessages = messagesData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    const messagesContainer = document.getElementById('recentMessages');
    if (recentMessages.length === 0) {
        messagesContainer.innerHTML = '<p class="text-secondary text-center py-4"><i class="fa-solid fa-inbox me-2"></i>لا توجد رسائل</p>';
    } else {
        messagesContainer.innerHTML = recentMessages.map(msg => `
            <div class="recent-item" onclick="viewMessage(${messagesData.indexOf(msg)})">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="recent-item-title">${msg.name}</div>
                        <div class="recent-item-meta">
                            ${msg.subject} • ${new Date(msg.date).toLocaleDateString('ar-EG')}
                        </div>
                    </div>
                    ${!msg.read ? '<span class="badge bg-gold text-dark">جديد</span>' : ''}
                </div>
            </div>
        `).join('');
    }
    
    // Load recent products
    const recentProducts = productsData.slice(-5).reverse();
    
    const productsContainer = document.getElementById('recentProducts');
    if (recentProducts.length === 0) {
        productsContainer.innerHTML = '<p class="text-secondary text-center py-4"><i class="fa-solid fa-box me-2"></i>لا توجد منتجات</p>';
    } else {
        productsContainer.innerHTML = recentProducts.map(product => `
            <div class="recent-item">
                <div class="recent-item-title">${product.name}</div>
                <div class="recent-item-meta">
                    ${product.price}
                </div>
            </div>
        `).join('');
    }
}

// Load recent videos
function loadRecentVideos() {
    const recentVideos = videosData.slice(-5).reverse();
    
    const videosContainer = document.getElementById('recentVideos');
    if (recentVideos.length === 0) {
        videosContainer.innerHTML = '<p class="text-secondary text-center py-4"><i class="fa-solid fa-video me-2"></i>لا توجد فيديوهات</p>';
    } else {
        videosContainer.innerHTML = recentVideos.map(video => `
            <div class="recent-item">
                <div class="recent-item-title">${video.title}</div>
                <div class="recent-item-meta">
                    <span class="badge bg-secondary me-2">${getVideoTypeName(video.type)}</span>
                </div>
            </div>
        `).join('');
    }
}

// Helper functions
function getVideoTypeName(type) {
    const names = {
        'tutorial': 'شروحات',
        'testimonial': 'آراء عملاء',
        'factory': 'من المصنع'
    };
    return names[type] || type;
}

function updateUnreadBadge() {
    const unreadCount = messagesData.filter(m => !m.read).length;
    
    const badge = document.getElementById('unreadBadge');
    if (unreadCount > 0) {
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = 'inline-block';
        }
    } else {
        if (badge) badge.style.display = 'none';
    }
}

function updateLastUpdate() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
    document.getElementById('lastUpdate').textContent = `${timeString} - ${dateString}`;
    
    const systemUpdate = document.getElementById('systemLastUpdate');
    if (systemUpdate) {
        systemUpdate.textContent = now.toLocaleDateString('ar-EG');
    }
}

// Page navigation functions
function loadProductsPage(event) {
    if (event) event.preventDefault();
    
    showView('productsPage');
    updateSidebarActive('products');
    
    loadProductsTable();
    resetProductForm();
}

function loadVideosPage(event) {
    if (event) event.preventDefault();
    
    showView('videosPage');
    updateSidebarActive('videos');
    
    loadVideosTable();
    resetVideoForm();
}

function loadSparepartsPage(event) {
    if (event) event.preventDefault();
    
    showView('sparePartsPage');
    updateSidebarActive('spare-parts');
    
    loadSparePartsGrid();
    resetSparePartForm();
    
    // Setup search and filter event listeners
    setupSparePartsFilters();
}

function loadSoftwarePage(event) {
    if (event) event.preventDefault();
    
    showView('softwarePage');
    updateSidebarActive('software');
    
    loadSoftwareGrid();
    resetSoftwareForm();
    
    // Setup search and filter event listeners
    setupSoftwareFilters();
}

function loadMessagesPage(event) {
    if (event) event.preventDefault();
    
    showView('messagesPage');
    updateSidebarActive('messages');
    
    loadMessagesTable();
}

function loadSettingsPage(event) {
    if (event) event.preventDefault();
    
    showView('settingsPage');
    updateSidebarActive('settings');
    
    loadSettingsForm();
}

function loadUsersPage(event) {
    if (event) event.preventDefault();
    
    showView('usersPage');
    updateSidebarActive('users');
    
    loadUsersTable();
    resetUserForm();
}

function loadTestimonialsPage(event) {
    if (event) event.preventDefault();
    
    showView('testimonialsPage');
    updateSidebarActive('testimonials');
    
    loadTestimonialsTable();
}

function showView(viewId) {
    // Hide all views
    document.querySelectorAll('.dashboard-view').forEach(view => {
        view.style.display = 'none';
    });
    
    // Show selected view
    document.getElementById(viewId).style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function updateSidebarActive(page) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
}

// Products Management
function loadProductsTable() {
    const gridContainer = document.getElementById('productGrid');
    
    if (!gridContainer) {
        console.error('Product grid container not found');
        return;
    }
    
    if (productsData.length === 0) {
        gridContainer.innerHTML = '<p class="text-center text-secondary py-4"><i class="fa-solid fa-box me-2"></i>لا توجد منتجات</p>';
        return;
    }
    
    gridContainer.innerHTML = productsData.map((product, index) => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="product-card-dashboard glass-card">
                ${product.image ? `<img src="${product.image}" class="product-image" alt="${product.name}" />` : '<i class="fa-solid fa-image text-secondary"></i>'}
                <h5 class="product-title">${product.name}</h5>
                <p class="product-price">${product.price}</p>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="editProduct(${index})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

function resetProductForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productImagePreview').innerHTML = '';
    currentProductId = null;
}

function saveProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value;
    const image = document.getElementById('productImage').files[0];
    
    if (!name || !price) {
        Swal.fire({
            icon: 'warning',
            title: 'خطأ',
            text: 'الرجاء ملء جميع الحقول المطلوبة',
            confirmButtonColor: '#ec9c04'
        });
        return;
    }
    
    let imageData = null;
    if (image) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const product = {
                id: currentProductId !== null ? productsData[currentProductId].id : Date.now().toString(),
                name,
                price,
                description,
                image: e.target.result,
                specs: {
                    power: price
                }
            };
            
            if (currentProductId !== null) {
                productsData[currentProductId] = product;
            } else {
                productsData.push(product);
            }
            
            localStorage.setItem('products', JSON.stringify(productsData));
            
            Swal.fire({
                icon: 'success',
                title: 'تم بنجاح',
                text: 'تم حفظ المنتج بنجاح',
                confirmButtonColor: '#ec9c04'
            });
            
            const modalEl = document.getElementById('productModal');
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.hide();
            
            loadProductsTable();
            loadAllData();
        };
        reader.readAsDataURL(image);
    } else {
        const product = {
            id: currentProductId !== null ? productsData[currentProductId].id : Date.now().toString(),
            name,
            price,
            description,
            image: currentProductId !== null ? productsData[currentProductId].image : null,
            specs: {
                power: price
            }
        };
        
        if (currentProductId !== null) {
            productsData[currentProductId] = product;
        } else {
            productsData.push(product);
        }
        
        localStorage.setItem('products', JSON.stringify(productsData));
        
        Swal.fire({
            icon: 'success',
            title: 'تم بنجاح',
            text: 'تم حفظ المنتج بنجاح',
            confirmButtonColor: '#ec9c04'
        });
        
        const modalEl = document.getElementById('productModal');
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
        
        loadProductsTable();
        loadAllData();
    }
}

function editProduct(index) {
    currentProductId = index;
    const product = productsData[index];
    
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    
    if (product.image) {
        document.getElementById('productImagePreview').innerHTML = 
            `<img src="${product.image}" style="max-width: 200px; border-radius: 8px;">`;
    }
    
    const modalEl = document.getElementById('productModal');
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
}

function deleteProduct(index) {
    Swal.fire({
        title: 'حذف المنتج',
        text: 'هل تريد فعلاً حذف هذا المنتج؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ec9c04',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'نعم، احذفه',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            productsData.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(productsData));
            
            Swal.fire({
                icon: 'success',
                title: 'تم الحذف',
                text: 'تم حذف المنتج بنجاح',
                confirmButtonColor: '#ec9c04'
            });
            
            loadProductsTable();
            loadAllData();
        }
    });
}

// Videos Management
function loadVideosTable() {
    const container = document.getElementById('videosTableBody');
    
    if (videosData.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-secondary py-4">لا توجد فيديوهات</div>';
        return;
    }
    
    container.innerHTML = videosData.map((video, index) => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm border-0">
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: #1a1a1a;">
                    ${getVideoEmbed(video.url)}
                </div>
                <div class="card-body">
                    <h6 class="card-title mb-2">${video.title}</h6>
                    <p class="card-text small text-secondary">
                        <span class="badge bg-gold text-dark">${getVideoTypeName(video.type)}</span>
                    </p>
                </div>
                <div class="card-footer bg-white border-top d-flex gap-2">
                    <button class="btn btn-sm btn-outline-warning flex-grow-1" onclick="editVideo(${index})">
                        <i class="fa-solid fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-sm btn-outline-danger flex-grow-1" onclick="deleteVideo(${index})">
                        <i class="fa-solid fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function resetVideoForm() {
    document.getElementById('videoForm').reset();
    document.getElementById('videoModalTitle').textContent = 'إضافة فيديو';
    currentVideoId = null;
}

function saveVideo() {
    const title = document.getElementById('videoTitle').value?.trim() || '';
    const type = document.getElementById('videoType').value?.trim() || '';
    const url = document.getElementById('videoUrl').value?.trim() || '';
    
    if (!title || !type || !url) {
        Swal.fire({
            icon: 'warning',
            title: 'خطأ',
            text: 'الرجاء ملء جميع الحقول المطلوبة',
            confirmButtonColor: '#ec9c04'
        });
        return;
    }
    
    // Auto-generate thumbnail from URL
    const image = getVideoThumbnail(url);
    
    const video = {
        id: currentVideoId !== null ? videosData[currentVideoId].id : Date.now().toString(),
        title,
        type,
        url,
        image: image
    };
    
    if (currentVideoId !== null) {
        videosData[currentVideoId] = video;
    } else {
        videosData.push(video);
    }
    
    localStorage.setItem('videos', JSON.stringify(videosData));
    
    Swal.fire({
        icon: 'success',
        title: 'تم بنجاح',
        text: 'تم حفظ الفيديو بنجاح',
        confirmButtonColor: '#ec9c04'
    });
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('videoModal'));
    modal?.hide();
    
    resetVideoForm();
    loadAllData();
    loadVideosTable();
}

// Function to extract video thumbnail from URL
function getVideoThumbnail(url) {
    if (!url) return '';
    
    // YouTube - handle different URL formats
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop()?.split('?')[0];
        if (videoId && !isNaN(videoId)) {
            // Return placeholder for Vimeo since API requires auth
            return `https://vimeo.com/api/v2/video/${videoId}.json`;
        }
    }
    
    return '';
}

// Function to get embedded video iframe
function getVideoEmbed(url) {
    if (!url) return '';
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        if (videoId) {
            return `<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;" src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
        return `<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;" src="${url}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    }
    
    return '<div style="padding: 20px; background: linear-gradient(135deg, #1a1a1a, #2d2d2d); text-align: center; color: #ec9c04; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 8px;"><i class="fa-solid fa-video" style="font-size: 40px; margin-bottom: 10px;"></i><div>فيديو غير متاح</div></div>';
}

function editVideo(index) {
    currentVideoId = index;
    const video = videosData[index];
    
    document.getElementById('videoTitle').value = video.title;
    document.getElementById('videoType').value = video.type;
    document.getElementById('videoUrl').value = video.url;
    document.getElementById('videoModalTitle').textContent = 'تعديل فيديو';
    
    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
    modal.show();
}

function deleteVideo(index) {
    Swal.fire({
        title: 'حذف الفيديو',
        text: 'هل تريد فعلاً حذف هذا الفيديو؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ec9c04',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'نعم، احذفه',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            videosData.splice(index, 1);
            localStorage.setItem('videos', JSON.stringify(videosData));
            
            Swal.fire({
                icon: 'success',
                title: 'تم الحذف',
                text: 'تم حذف الفيديو بنجاح',
                confirmButtonColor: '#ec9c04'
            });
            
            loadVideosTable();
            loadAllData();
        }
    });
}

// Messages Management
function loadMessagesTable() {
    const tbody = document.getElementById('messagesTableBody');
    
    if (messagesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-secondary py-4">لا توجد رسائل</td></tr>';
        return;
    }
    
    tbody.innerHTML = messagesData.map((msg, index) => `
        <tr class="${!msg.read ? 'table-active' : ''}">
            <td>${msg.name}</td>
            <td>${msg.email}</td>
            <td>${msg.subject}</td>
            <td>${new Date(msg.date).toLocaleDateString('ar-EG')}</td>
            <td>
                ${!msg.read ? '<span class="badge bg-danger">غير مقروء</span>' : '<span class="badge bg-success">مقروء</span>'}
            </td>
            <td>
                <button class="btn btn-sm btn-outline-info" onclick="viewMessage(${index})">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMessage(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewMessage(index) {
    currentMessageId = index;
    const msg = messagesData[index];
    
    // Mark as read
    msg.read = true;
    localStorage.setItem('messages', JSON.stringify(messagesData));
    updateUnreadBadge();
    
    const details = `
        <div class="message-details">
            <div class="mb-3">
                <strong class="text-white">الاسم:</strong>
                <p class="text-secondary">${msg.name}</p>
            </div>
            <div class="mb-3">
                <strong class="text-white">البريد الإلكتروني:</strong>
                <p class="text-secondary"><a href="mailto:${msg.email}" class="text-gold">${msg.email}</a></p>
            </div>
            <div class="mb-3">
                <strong class="text-white">الموضوع:</strong>
                <p class="text-secondary">${msg.subject}</p>
            </div>
            <div class="mb-3">
                <strong class="text-white">التاريخ:</strong>
                <p class="text-secondary">${new Date(msg.date).toLocaleDateString('ar-EG')}</p>
            </div>
            <div class="mb-3">
                <strong class="text-white">الرسالة:</strong>
                <div class="alert alert-secondary" style="margin-top: 10px;">
                    ${msg.message}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('messageDetails').innerHTML = details;
    
    const modal = new bootstrap.Modal(document.getElementById('messageModal'));
    modal.show();
    
    loadMessagesTable();
}

function deleteMessage(index) {
    Swal.fire({
        title: 'حذف الرسالة',
        text: 'هل تريد فعلاً حذف هذه الرسالة؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ec9c04',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'نعم، احذفها',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            messagesData.splice(index, 1);
            localStorage.setItem('messages', JSON.stringify(messagesData));
            
            Swal.fire({
                icon: 'success',
                title: 'تم الحذف',
                text: 'تم حذف الرسالة بنجاح',
                confirmButtonColor: '#ec9c04'
            });
            
            loadMessagesTable();
            loadAllData();
        }
    });
}

function deleteCurrentMessage() {
    if (currentMessageId !== null) {
        deleteMessage(currentMessageId);
        const modal = bootstrap.Modal.getInstance(document.getElementById('messageModal'));
        modal.hide();
    }
}

function markAllMessagesRead() {
    messagesData.forEach(msg => msg.read = true);
    localStorage.setItem('messages', JSON.stringify(messagesData));
    
    Swal.fire({
        icon: 'success',
        title: 'تم بنجاح',
        text: 'تم وضع علامة على جميع الرسائل كمقروءة',
        confirmButtonColor: '#ec9c04'
    });
    
    updateUnreadBadge();
    loadMessagesTable();
    loadAllData();
}

// Settings Management
function loadSettingsForm() {
    const settings = JSON.parse(localStorage.getItem('siteSetting')) || {
        siteName: 'Focus Laser',
        siteEmail: 'info@focus-laser.com',
        sitePhone: '+966'
    };
    
    document.getElementById('siteName').value = settings.siteName || '';
    document.getElementById('siteEmail').value = settings.siteEmail || '';
    document.getElementById('sitePhone').value = settings.sitePhone || '';
    
    updateLastUpdate();
}

function saveSettings() {
    const settings = {
        siteName: document.getElementById('siteName').value,
        siteEmail: document.getElementById('siteEmail').value,
        sitePhone: document.getElementById('sitePhone').value
    };
    
    localStorage.setItem('siteSetting', JSON.stringify(settings));
    
    Swal.fire({
        icon: 'success',
        title: 'تم بنجاح',
        text: 'تم حفظ الإعدادات بنجاح',
        confirmButtonColor: '#ec9c04'
    });
}

// Users Management
function loadUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    
    if (usersData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-secondary py-4">لا توجد مستخدمين</td></tr>';
        return;
    }
    
    tbody.innerHTML = usersData.map((user, index) => `
        <tr>
            <td>${user.email}</td>
            <td><span class="badge bg-secondary">${user.role}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
            <td>
                <button class="btn btn-sm btn-outline-warning" onclick="editUser(${index})">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function resetUserForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userModalTitle').textContent = 'إضافة مستخدم';
    currentUserId = null;
}

function saveUser() {
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    
    if (!email || !password || !role) {
        Swal.fire({
            icon: 'warning',
            title: 'خطأ',
            text: 'الرجاء ملء جميع الحقول',
            confirmButtonColor: '#ec9c04'
        });
        return;
    }
    
    const user = {
        id: currentUserId !== null ? usersData[currentUserId].id : Date.now().toString(),
        email,
        password: btoa(password),
        role,
        createdAt: currentUserId !== null ? usersData[currentUserId].createdAt : new Date().toISOString()
    };
    
    if (currentUserId !== null) {
        usersData[currentUserId] = user;
    } else {
        usersData.push(user);
    }
    
    localStorage.setItem('users', JSON.stringify(usersData));
    
    Swal.fire({
        icon: 'success',
        title: 'تم بنجاح',
        text: 'تم حفظ المستخدم بنجاح',
        confirmButtonColor: '#ec9c04'
    });
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
    modal.hide();
    
    resetUserForm();
    loadAllData();
    loadUsersTable();
}

function editUser(index) {
    currentUserId = index;
    const user = usersData[index];
    
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = atob(user.password);
    document.getElementById('userRole').value = user.role;
    document.getElementById('userModalTitle').textContent = 'تعديل مستخدم';
    
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

function deleteUser(index) {
    Swal.fire({
        title: 'حذف المستخدم',
        text: 'هل تريد فعلاً حذف هذا المستخدم؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ec9c04',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'نعم، احذفه',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            usersData.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(usersData));
            
            Swal.fire({
                icon: 'success',
                title: 'تم الحذف',
                text: 'تم حذف المستخدم بنجاح',
                confirmButtonColor: '#ec9c04'
            });
            
            loadAllData();
            loadUsersTable();
        }
    });
}

// Logout function
function logout(event) {
    if (event) event.preventDefault();
    
    Swal.fire({
        title: 'تسجيل الخروج',
        text: 'هل تريد تسجيل الخروج من لوحة التحكم؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ec9c04',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'نعم',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            window.location.href = '../auth/login.html';
        }
    });
}




// Excel Export Function
function exportToExcel() {
    // Prepare data
    const exportData = {
        'إحصائيات عامة': [
            ['عنصر', 'القيمة'],
            ['عدد المنتجات', document.getElementById('productsCount').textContent],
            ['عدد الفيديوهات', document.getElementById('videosCount').textContent],
            ['عدد الرسائل', document.getElementById('messagesCount').textContent],
            ['الرسائل غير المقروءة', document.getElementById('unreadMessagesCount').textContent],
        ]
    };
    
    // Create workbook
    let html = '<table border="1"><tr style="background-color: #f2f2f2"><th colspan="2"><b>تقرير Dashboard - Focus Laser</b></th></tr>';
    
    for (let [sheetName, data] of Object.entries(exportData)) {
        html += `<tr><td colspan="2"><b>${sheetName}</b></td></tr>`;
        data.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                html += `<td>${cell}</td>`;
            });
            html += '</tr>';
        });
        html += '<tr><td colspan="2">&nbsp;</td></tr>';
    }
    html += '</table>';
    
    // Download
    const link = document.createElement('a');
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=UTF-8' });
    link.href = URL.createObjectURL(blob);
    link.download = `Focus-Laser-Dashboard-${new Date().toLocaleDateString('ar-EG')}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    Swal.fire({
        title: 'تم التحميل',
        text: 'تم تحميل التقرير بنجاح',
        icon: 'success',
        confirmButtonColor: '#ec9c04',
        confirmButtonText: 'حسناً'
    });
}

// Image preview handlers
document.addEventListener('change', function(e) {
    if (e.target.id === 'productImage') {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('productImagePreview').innerHTML = 
                    `<img src="${event.target.result}" style="max-width: 200px; border-radius: 8px;">`;
            };
            reader.readAsDataURL(file);
        }
    }
});

// ============================================
// Testimonials Management Functions
// ============================================

let testimonialsData = [];
let currentTestimonialId = null;
const testimonialModal = new bootstrap.Modal(document.getElementById('testimonialModal'));

function loadTestimonialsTable() {
    testimonialsData = JSON.parse(localStorage.getItem('testimonials')) || [];
    const table = document.getElementById('testimonialsTable');
    table.innerHTML = '';

    if (testimonialsData.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="text-center text-secondary">لا توجد آراء حتى الآن</td></tr>';
        updateTestimonialsStats();
        return;
    }

    testimonialsData.forEach(testimonial => {
        const typeLabel = {
            'fiber': 'ليزر فايبر',
            'co2': 'ليزر CO2',
            'uv': 'ليزر UV'
        }[testimonial.type] || testimonial.type;

        const rating = '⭐'.repeat(testimonial.rating);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-white">${testimonial.clientName}</td>
            <td class="text-secondary">${testimonial.company}</td>
            <td><span class="badge bg-gold">${typeLabel}</span></td>
            <td class="text-gold">${rating}</td>
            <td>
                <button class="btn btn-sm btn-outline-gold me-2" onclick="editTestimonialFromDashboard(${testimonial.id})">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTestimonialFromDashboard(${testimonial.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        table.appendChild(row);
    });

    updateTestimonialsStats();
}

function updateTestimonialsStats() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    
    document.getElementById('testimonialsCount').textContent = testimonials.length;
    document.getElementById('videosCount').textContent = testimonials.length;
    
    const avgRating = testimonials.length > 0 
        ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
        : 0;
    document.getElementById('avgRating').textContent = avgRating;

    const companies = new Set(testimonials.map(t => t.company)).size;
    document.getElementById('companiesCount').textContent = companies;
}

function showAddTestimonialModal() {
    currentTestimonialId = null;
    document.getElementById('testimonialForm').reset();
    document.getElementById('modalTitle').textContent = 'إضافة رأي جديد';
    testimonialModal.show();
}

function editTestimonialFromDashboard(id) {
    const testimonial = testimonialsData.find(t => t.id === id);
    if (!testimonial) return;

    currentTestimonialId = id;
    document.getElementById('clientName').value = testimonial.clientName;
    document.getElementById('company').value = testimonial.company;
    document.getElementById('typeSelect').value = testimonial.type;
    document.getElementById('videoId').value = testimonial.videoId;
    document.getElementById('testimonialText').value = testimonial.text;
    document.getElementById('rating').value = testimonial.rating;
    document.getElementById('modalTitle').textContent = 'تعديل الرأي';
    testimonialModal.show();
}

function saveTestimonialFromDashboard() {
    const clientName = document.getElementById('clientName').value;
    const company = document.getElementById('company').value;
    const type = document.getElementById('typeSelect').value;
    const videoId = document.getElementById('videoId').value;
    const text = document.getElementById('testimonialText').value;
    const rating = parseInt(document.getElementById('rating').value);

    if (!clientName || !company || !type || !videoId || !text) {
        Swal.fire('خطأ', 'الرجاء ملء جميع الحقول', 'error');
        return;
    }

    if (currentTestimonialId) {
        const index = testimonialsData.findIndex(t => t.id === currentTestimonialId);
        if (index !== -1) {
            testimonialsData[index] = {
                ...testimonialsData[index],
                clientName, company, type, videoId, text, rating
            };
        }
    } else {
        const newTestimonial = {
            id: Date.now(),
            clientName, company, type, videoId, text, rating,
            avatar: '👤'
        };
        testimonialsData.push(newTestimonial);
    }

    localStorage.setItem('testimonials', JSON.stringify(testimonialsData));
    testimonialModal.hide();
    loadTestimonialsTable();

    Swal.fire('تم', 'تم حفظ الرأي بنجاح', 'success');
}

function deleteTestimonialFromDashboard(id) {
    Swal.fire({
        title: 'تأكيد الحذف',
        text: 'هل أنت متأكد من حذف هذا الرأي؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ec9c04',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            testimonialsData = testimonialsData.filter(t => t.id !== id);
            localStorage.setItem('testimonials', JSON.stringify(testimonialsData));
            loadTestimonialsTable();
            Swal.fire('تم', 'تم حذف الرأي بنجاح', 'success');
        }
    });
}

// ============================================
// SPARE PARTS FUNCTIONS
// ============================================

function loadSparePartsGrid() {
    const grid = document.getElementById('sparePartsGrid');
    if (!grid) return;
    
    if (sparePartsData.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-secondary">لا توجد قطع غيار مضافة</p></div>';
        return;
    }
    
    grid.innerHTML = sparePartsData.map(part => `
        <div class="col-lg-4 col-md-6">
            <div class="product-card-dashboard glass-card p-3">
                <div class="product-image-container mb-3">
                    <img src="${part.image || '../../images/logo.png'}" alt="${part.name}" class="product-image">
                </div>
                <h5 class="text-white mb-2">${part.name}</h5>
                <p class="text-secondary small mb-3">${part.description || ''}</p>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-gold fw-bold">${part.price ? 'ج.م ' + part.price : 'اتصل للسعر'}</span>
                    <span class="badge bg-${part.stock > 0 ? 'success' : 'danger'}">${part.stock || 0} قطعة</span>
                </div>
                <div class="small text-secondary mb-3">متوافق مع: ${part.compatibility || 'غير محدد'}</div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-gold flex-fill" onclick="editSparePart(${part.id})">
                        <i class="fa-solid fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-sm btn-danger flex-fill" onclick="deleteSparePart(${part.id})">
                        <i class="fa-solid fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function resetSparePartForm() {
    currentSparePartId = null;
    document.getElementById('sparePartModalTitle').textContent = 'إضافة قطعة غيار جديدة';
    document.getElementById('sparePartForm').reset();
    document.getElementById('sparePartImagePreview').innerHTML = '';
}

function editSparePart(id) {
    const part = sparePartsData.find(p => p.id === id);
    if (!part) return;
    
    currentSparePartId = id;
    document.getElementById('sparePartModalTitle').textContent = 'تعديل قطعة الغيار';
    document.getElementById('sparePartName').value = part.name;
    document.getElementById('sparePartPrice').value = part.price || '';
    document.getElementById('sparePartStock').value = part.stock || '';
    document.getElementById('sparePartDescription').value = part.description || '';
    document.getElementById('sparePartCompatibility').value = part.compatibility || '';
    
    if (part.image) {
        document.getElementById('sparePartImagePreview').innerHTML = `<img src="${part.image}" class="img-thumbnail" style="max-height: 100px;">`;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('sparePartModal'));
    modal.show();
}

function saveSparePart() {
    const name = document.getElementById('sparePartName').value;
    const price = document.getElementById('sparePartPrice').value;
    const stock = document.getElementById('sparePartStock').value;
    const description = document.getElementById('sparePartDescription').value;
    const compatibility = document.getElementById('sparePartCompatibility').value;
    
    if (!name || !description) {
        Swal.fire('خطأ', 'الرجاء ملء الحقول المطلوبة', 'error');
        return;
    }
    
    const sparePartData = {
        name, price, stock, description, compatibility,
        image: document.getElementById('sparePartImagePreview').querySelector('img')?.src || '../../images/logo.png'
    };
    
    if (currentSparePartId) {
        const index = sparePartsData.findIndex(p => p.id === currentSparePartId);
        if (index !== -1) {
            sparePartsData[index] = { ...sparePartsData[index], ...sparePartData };
        }
    } else {
        sparePartData.id = Date.now();
        sparePartData.dateAdded = new Date().toISOString();
        sparePartsData.push(sparePartData);
    }
    
    localStorage.setItem('spareParts', JSON.stringify(sparePartsData));
    bootstrap.Modal.getInstance(document.getElementById('sparePartModal')).hide();
    loadSparePartsGrid();
    updateStats();
    
    Swal.fire('تم', 'تم حفظ قطعة الغيار بنجاح', 'success');
}

function deleteSparePart(id) {
    Swal.fire({
        title: 'تأكيد الحذف',
        text: 'هل أنت متأكد من حذف هذه القطعة؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ec9c04',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            sparePartsData = sparePartsData.filter(p => p.id !== id);
            localStorage.setItem('spareParts', JSON.stringify(sparePartsData));
            loadSparePartsGrid();
            updateStats();
            Swal.fire('تم', 'تم حذف القطعة بنجاح', 'success');
        }
    });
}

function setupSparePartsFilters() {
    const searchInput = document.getElementById('sparePartsSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterSpareParts);
    }
}

function filterSpareParts() {
    const searchTerm = document.getElementById('sparePartsSearch')?.value.toLowerCase() || '';
    
    const filtered = sparePartsData.filter(part => {
        const matchesSearch = part.name.toLowerCase().includes(searchTerm) || 
                             (part.description && part.description.toLowerCase().includes(searchTerm));
        return matchesSearch;
    });
    
    const grid = document.getElementById('sparePartsGrid');
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-secondary">لا توجد نتائج للبحث</p></div>';
        return;
    }
    
    grid.innerHTML = filtered.map(part => `
        <div class="col-lg-4 col-md-6">
            <div class="product-card-dashboard glass-card p-3">
                <div class="product-image-container mb-3">
                    <img src="${part.image || '../../images/logo.png'}" alt="${part.name}" class="product-image">
                </div>
                <h5 class="text-white mb-2">${part.name}</h5>
                <p class="text-secondary small mb-3">${part.description || ''}</p>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-gold fw-bold">${part.price ? 'ج.م ' + part.price : 'اتصل للسعر'}</span>
                    <span class="badge bg-${part.stock > 0 ? 'success' : 'danger'}">${part.stock || 0} قطعة</span>
                </div>
                <div class="small text-secondary mb-3">متوافق مع: ${part.compatibility || 'غير محدد'}</div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-gold flex-fill" onclick="editSparePart(${part.id})">
                        <i class="fa-solid fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-sm btn-danger flex-fill" onclick="deleteSparePart(${part.id})">
                        <i class="fa-solid fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function exportSparePartsToExcel() {
    // Simple CSV export
    const csv = [
        ['اسم القطعة', 'السعر', 'الكمية', 'الوصف', 'التوافق'],
        ...sparePartsData.map(part => [
            part.name,
            part.price || 'اتصل للسعر',
            part.stock || 0,
            part.description || '',
            part.compatibility || ''
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'spare-parts.csv';
    link.click();
}

// ============================================
// SOFTWARE FUNCTIONS
// ============================================

function loadSoftwareGrid() {
    const grid = document.getElementById('softwareGrid');
    if (!grid) return;
    
    if (softwareData.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-secondary">لا توجد برامج مضافة</p></div>';
        return;
    }
    
    grid.innerHTML = softwareData.map(software => `
        <div class="col-lg-4 col-md-6">
            <div class="product-card-dashboard glass-card p-3">
                <div class="product-image-container mb-3">
                    <img src="${software.image || '../../images/logo.png'}" alt="${software.name}" class="product-image">
                </div>
                <h5 class="text-white mb-2">${software.name}</h5>
                <p class="text-secondary small mb-2">${software.description || ''}</p>
                <div class="small text-gold mb-2">الإصدار: ${software.version || 'غير محدد'}</div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-gold fw-bold">${software.price ? 'ج.م ' + software.price : 'مجاني'}</span>
                </div>
                <div class="small text-secondary mb-3">متوافق مع: ${software.compatibility || 'غير محدد'}</div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-gold flex-fill" onclick="editSoftware(${software.id})">
                        <i class="fa-solid fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-sm btn-danger flex-fill" onclick="deleteSoftware(${software.id})">
                        <i class="fa-solid fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function resetSoftwareForm() {
    currentSoftwareId = null;
    document.getElementById('softwareModalTitle').textContent = 'إضافة برنامج جديد';
    document.getElementById('softwareForm').reset();
    document.getElementById('softwareImagePreview').innerHTML = '';
}

function editSoftware(id) {
    const software = softwareData.find(s => s.id === id);
    if (!software) return;
    
    currentSoftwareId = id;
    document.getElementById('softwareModalTitle').textContent = 'تعديل البرنامج';
    document.getElementById('softwareName').value = software.name;
    document.getElementById('softwareVersion').value = software.version || '';
    document.getElementById('softwarePrice').value = software.price || '';
    document.getElementById('softwareDescription').value = software.description || '';
    document.getElementById('softwareDownloadLink').value = software.downloadLink || '';
    document.getElementById('softwareCompatibility').value = software.compatibility || '';
    document.getElementById('softwareFeatures').value = software.features || '';
    
    if (software.image) {
        document.getElementById('softwareImagePreview').innerHTML = `<img src="${software.image}" class="img-thumbnail" style="max-height: 100px;">`;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('softwareModal'));
    modal.show();
}

function saveSoftware() {
    const name = document.getElementById('softwareName').value;
    const version = document.getElementById('softwareVersion').value;
    const price = document.getElementById('softwarePrice').value;
    const description = document.getElementById('softwareDescription').value;
    const downloadLink = document.getElementById('softwareDownloadLink').value;
    const compatibility = document.getElementById('softwareCompatibility').value;
    const features = document.getElementById('softwareFeatures').value;
    
    if (!name || !description) {
        Swal.fire('خطأ', 'الرجاء ملء الحقول المطلوبة', 'error');
        return;
    }
    
    const softwareData = {
        name, version, price, description, downloadLink, compatibility, features,
        image: document.getElementById('softwareImagePreview').querySelector('img')?.src || '../../images/logo.png'
    };
    
    if (currentSoftwareId) {
        const index = softwareData.findIndex(s => s.id === currentSoftwareId);
        if (index !== -1) {
            softwareData[index] = { ...softwareData[index], ...softwareData };
        }
    } else {
        softwareData.id = Date.now();
        softwareData.dateAdded = new Date().toISOString();
        softwareData.push(softwareData);
    }
    
    localStorage.setItem('software', JSON.stringify(softwareData));
    bootstrap.Modal.getInstance(document.getElementById('softwareModal')).hide();
    loadSoftwareGrid();
    updateStats();
    
    Swal.fire('تم', 'تم حفظ البرنامج بنجاح', 'success');
}

function deleteSoftware(id) {
    Swal.fire({
        title: 'تأكيد الحذف',
        text: 'هل أنت متأكد من حذف هذا البرنامج؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ec9c04',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            softwareData = softwareData.filter(s => s.id !== id);
            localStorage.setItem('software', JSON.stringify(softwareData));
            loadSoftwareGrid();
            updateStats();
            Swal.fire('تم', 'تم حذف البرنامج بنجاح', 'success');
        }
    });
}

function setupSoftwareFilters() {
    const searchInput = document.getElementById('softwareSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterSoftware);
    }
}

function filterSoftware() {
    const searchTerm = document.getElementById('softwareSearch')?.value.toLowerCase() || '';
    
    const filtered = softwareData.filter(software => {
        const matchesSearch = software.name.toLowerCase().includes(searchTerm) || 
                             (software.description && software.description.toLowerCase().includes(searchTerm));
        return matchesSearch;
    });
    
    const grid = document.getElementById('softwareGrid');
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-secondary">لا توجد نتائج للبحث</p></div>';
        return;
    }
    
    grid.innerHTML = filtered.map(software => `
        <div class="col-lg-4 col-md-6">
            <div class="product-card-dashboard glass-card p-3">
                <div class="product-image-container mb-3">
                    <img src="${software.image || '../../images/logo.png'}" alt="${software.name}" class="product-image">
                </div>
                <h5 class="text-white mb-2">${software.name}</h5>
                <p class="text-secondary small mb-2">${software.description || ''}</p>
                <div class="small text-gold mb-2">الإصدار: ${software.version || 'غير محدد'}</div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-gold fw-bold">${software.price ? 'ج.م ' + software.price : 'مجاني'}</span>
                </div>
                <div class="small text-secondary mb-3">متوافق مع: ${software.compatibility || 'غير محدد'}</div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-gold flex-fill" onclick="editSoftware(${software.id})">
                        <i class="fa-solid fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-sm btn-danger flex-fill" onclick="deleteSoftware(${software.id})">
                        <i class="fa-solid fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function exportSoftwareToExcel() {
    // Simple CSV export
    const csv = [
        ['اسم البرنامج', 'الإصدار', 'السعر', 'الوصف', 'التوافق'],
        ...softwareData.map(software => [
            software.name,
            software.version || 'غير محدد',
            software.price || 'مجاني',
            software.description || '',
            software.compatibility || ''
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'software.csv';
    link.click();
}

// ============================================
// CSV Import/Export Helpers
// ============================================

function downloadTemplate(type) {
    const templates = {
        products: ['name', 'price', 'description', 'image'],
        spareParts: ['name', 'price', 'stock', 'description', 'compatibility', 'image'],
        software: ['name', 'version', 'price', 'description', 'downloadLink', 'compatibility', 'features', 'image'],
        videos: ['title', 'type', 'url'],
        messages: ['name', 'email', 'subject', 'message', 'date', 'read'],
        users: ['email', 'role', 'createdAt'],
        testimonials: ['clientName', 'company', 'type', 'videoId', 'text', 'rating']
    };

    const header = templates[type];
    if (!header) return;

    const sampleRow = header.map(key => `مثال_${key}`);
    const csv = [header, sampleRow].map(row => row.join(',')).join('\n');
    downloadCsv(`${type}-template.csv`, csv);
}

function exportData(type) {
    const dataset = getDatasetByType(type);
    if (!dataset) return;

    const rows = dataset.rows.map(item => dataset.headers.map(key => formatCsvValue(item[key])));
    const csv = [dataset.headers, ...rows].map(row => row.join(',')).join('\n');
    downloadCsv(`${type}.csv`, csv);
}

function handleImport(type, file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const parsed = parseCsv(text);
        if (!parsed || parsed.length === 0) {
            Swal.fire('خطأ', 'ملف غير صالح', 'error');
            return;
        }

        const headers = parsed[0];
        const rows = parsed.slice(1).filter(r => r.length && r.some(cell => cell.trim() !== ''));
        const items = rows.map(row => mapRowToObject(headers, row));

        if (!items.length) {
            Swal.fire('خطأ', 'لا توجد بيانات للاستيراد', 'error');
            return;
        }

        applyImportedData(type, items);
    };
    reader.readAsText(file, 'utf-8');
}

function getDatasetByType(type) {
    switch (type) {
        case 'products':
            return {
                headers: ['name', 'price', 'description', 'image'],
                rows: productsData
            };
        case 'spareParts':
            return {
                headers: ['name', 'price', 'stock', 'description', 'compatibility', 'image'],
                rows: sparePartsData
            };
        case 'software':
            return {
                headers: ['name', 'version', 'price', 'description', 'downloadLink', 'compatibility', 'features', 'image'],
                rows: softwareData
            };
        case 'videos':
            return {
                headers: ['title', 'type', 'url'],
                rows: videosData
            };
        case 'messages':
            return {
                headers: ['name', 'email', 'subject', 'message', 'date', 'read'],
                rows: messagesData
            };
        case 'users':
            return {
                headers: ['email', 'role', 'createdAt'],
                rows: usersData
            };
        case 'testimonials':
            return {
                headers: ['clientName', 'company', 'type', 'videoId', 'text', 'rating'],
                rows: testimonialsData
            };
        default:
            return null;
    }
}

function applyImportedData(type, items) {
    const nowIso = new Date().toISOString();

    switch (type) {
        case 'products':
            productsData = [...productsData, ...items.map(item => ({
                id: item.id || Date.now().toString() + Math.random().toString(16).slice(2),
                name: item.name || '',
                price: item.price || '',
                description: item.description || '',
                image: item.image || null,
                specs: { power: item.price || '' }
            }))];
            localStorage.setItem('products', JSON.stringify(productsData));
            loadProductsTable();
            break;
        case 'spareParts':
            sparePartsData = [...sparePartsData, ...items.map(item => ({
                id: item.id || Date.now().toString() + Math.random().toString(16).slice(2),
                name: item.name || '',
                price: item.price || '',
                stock: parseInt(item.stock || '0', 10) || 0,
                description: item.description || '',
                compatibility: item.compatibility || '',
                image: item.image || null,
                dateAdded: nowIso
            }))];
            localStorage.setItem('spareParts', JSON.stringify(sparePartsData));
            loadSparePartsGrid();
            break;
        case 'software':
            softwareData = [...softwareData, ...items.map(item => ({
                id: item.id || Date.now().toString() + Math.random().toString(16).slice(2),
                name: item.name || '',
                version: item.version || '',
                price: item.price || '',
                description: item.description || '',
                downloadLink: item.downloadLink || '',
                compatibility: item.compatibility || '',
                features: item.features || '',
                image: item.image || null,
                dateAdded: nowIso
            }))];
            localStorage.setItem('software', JSON.stringify(softwareData));
            loadSoftwareGrid();
            break;
        case 'videos':
            videosData = [...videosData, ...items.map(item => ({
                id: item.id || Date.now().toString() + Math.random().toString(16).slice(2),
                title: item.title || '',
                type: item.type || 'tutorial',
                url: item.url || '',
                image: getVideoThumbnail(item.url || '')
            }))];
            localStorage.setItem('videos', JSON.stringify(videosData));
            loadVideosTable();
            break;
        case 'messages':
            messagesData = [...messagesData, ...items.map(item => ({
                name: item.name || '',
                email: item.email || '',
                subject: item.subject || '',
                message: item.message || '',
                date: item.date || nowIso,
                read: String(item.read).toLowerCase() === 'true'
            }))];
            localStorage.setItem('messages', JSON.stringify(messagesData));
            loadMessagesTable();
            break;
        case 'users':
            usersData = [...usersData, ...items.map(item => ({
                id: item.id || Date.now().toString() + Math.random().toString(16).slice(2),
                email: item.email || '',
                role: item.role || 'user',
                createdAt: item.createdAt || nowIso
            }))];
            localStorage.setItem('users', JSON.stringify(usersData));
            loadUsersTable();
            break;
        case 'testimonials':
            testimonialsData = [...testimonialsData, ...items.map(item => ({
                id: item.id || Date.now(),
                clientName: item.clientName || '',
                company: item.company || '',
                type: item.type || 'fiber',
                videoId: item.videoId || '',
                text: item.text || '',
                rating: parseInt(item.rating || '5', 10) || 5,
                avatar: '👤'
            }))];
            localStorage.setItem('testimonials', JSON.stringify(testimonialsData));
            loadTestimonialsTable();
            break;
        default:
            return;
    }

    loadAllData();
    Swal.fire('تم', 'تم استيراد البيانات بنجاح', 'success');
}

function downloadCsv(filename, content) {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function parseCsv(text) {
    const lines = text.replace(/\r/g, '').split('\n').filter(line => line.trim() !== '');
    return lines.map(parseCsvLine);
}

function parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

function mapRowToObject(headers, row) {
    const obj = {};
    headers.forEach((header, index) => {
        obj[header] = row[index] ?? '';
    });
    return obj;
}

function formatCsvValue(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Setup image preview for spare parts and software
document.addEventListener('DOMContentLoaded', function() {
    // Spare parts image preview
    const sparePartImageInput = document.getElementById('sparePartImage');
    if (sparePartImageInput) {
        sparePartImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('sparePartImagePreview').innerHTML = 
                        `<img src="${e.target.result}" class="img-thumbnail" style="max-height: 100px;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Software image preview
    const softwareImageInput = document.getElementById('softwareImage');
    if (softwareImageInput) {
        softwareImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('softwareImagePreview').innerHTML = 
                        `<img src="${e.target.result}" class="img-thumbnail" style="max-height: 100px;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
