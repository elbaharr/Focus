/* =============================================
   FOCUS LASER - MAIN.JS
   تحسينات تفاعلية للموقع
============================================= */

// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 0. التحقق من حالة الدخول وإظهار/إخفاء الداشبورد
    // ============================================
    checkDashboardAccess();
    
    // ============================================
    // 1. Smooth Scroll للروابط الداخلية
    // ============================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80; // مسافة من الـ navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================
    // 2. Navbar Scroll Effect
    // ============================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ============================================
    // 3. Active Link Highlighting
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function updateActiveLink() {
        const scrollPosition = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // تحديث عند التحميل

    // ============================================
    // 4. Counter Animation للـ Stats
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const animateCounter = (element) => {
        const target = element.textContent.trim();
        const isNumber = /^\d+/.test(target);
        
        if (!isNumber) return; // تخطي "24/7" و "100%"
        
        const finalNumber = parseInt(target.replace(/[^0-9]/g, ''));
        const hasPlus = target.includes('+');
        const duration = 2000; // 2 ثانية
        const increment = finalNumber / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < finalNumber) {
                element.textContent = (hasPlus ? '+' : '') + Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target; // الرقم النهائي
            }
        };

        updateCounter();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ============================================
    // 5. Fade-in Animation للعناصر
    // ============================================
    const fadeElements = document.querySelectorAll('.machine-card, .feature-card-about, .client-logo-box, .stat-box');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // تأخير تدريجي
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });

    // ============================================
    // 6. Back to Top Button
    // ============================================
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'العودة للأعلى');
    document.body.appendChild(backToTopBtn);

    // إظهار/إخفاء الزر
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // النقر للعودة للأعلى
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // 7. Lazy Loading للصور (تحسين الأداء)
    // ============================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback للـ browsers القديمة
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // 8. إغلاق الـ Navbar على الموبايل بعد النقر
    // ============================================
    const navLinksMobile = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinksMobile.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

    // ============================================
    // 10. Responsive Adjustments
    // ============================================
    function handleResize() {
        // تعديل حجم الخطوط حسب حجم الشاشة
        const width = window.innerWidth;
        
        if (width < 576) {
            // Mobile - تحسينات إضافية
            document.body.style.fontSize = '14px';
        } else if (width < 768) {
            document.body.style.fontSize = '15px';
        } else if (width < 992) {
            document.body.style.fontSize = '16px';
        } else {
            document.body.style.fontSize = '';
        }

        // تعديل موضع زر Back to Top على الموبايل
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (width < 576) {
                backToTopBtn.style.bottom = '15px';
                backToTopBtn.style.left = '15px';
            } else {
                backToTopBtn.style.bottom = '30px';
                backToTopBtn.style.left = '30px';
            }
        }
    }

    // استدعاء عند التحميل والتغيير
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', function() {
        setTimeout(handleResize, 100);
    });

    // ============================================
    // 9. تحسين أداء الـ Carousel
    // ============================================
    const carousel = document.querySelector('#heroCarousel');
    if (carousel) {
        // إيقاف الـ autoplay عند hover
        carousel.addEventListener('mouseenter', function() {
            const bsCarousel = bootstrap.Carousel.getInstance(carousel);
            if (bsCarousel) {
                bsCarousel.pause();
            }
        });

        carousel.addEventListener('mouseleave', function() {
            const bsCarousel = bootstrap.Carousel.getInstance(carousel);
            if (bsCarousel) {
                bsCarousel.cycle();
            }
        });
    }

    // Load latest testimonials/videos
    loadLatestVideos();

});

// ============================================
// Load Latest Videos from Testimonials
// ============================================
function loadLatestVideos() {
    const container = document.getElementById('latestVideos');
    if (!container) return;

    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    const latestVideos = testimonials.slice(-3).reverse(); // Get last 3 videos, reversed to show newest first

    if (latestVideos.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><p class="text-secondary">لم يتم إضافة فيديوهات بعد</p></div>';
        return;
    }

    container.innerHTML = latestVideos.map(video => `
        <div class="col-lg-4 col-md-6">
            <div class="card video-card h-100 bg-dark border-gold">
                <div class="ratio ratio-16x9">
                    <iframe src="https://www.youtube.com/embed/${video.videoId}?rel=0" 
                            title="${video.clientName}" 
                            allowfullscreen="" 
                            loading="lazy">
                    </iframe>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-white">${video.clientName}</h5>
                    <p class="card-text text-secondary small">${video.company}</p>
                    <p class="card-text text-beige small mt-3">${video.text.substring(0, 80)}...</p>
                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <span class="text-gold">
                            ${'⭐'.repeat(video.rating)}
                        </span>
                        <a href="pages/testimonials/page.html" class="btn btn-sm btn-outline-gold">
                            <i class="fa-solid fa-play me-1"></i> شاهد
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// دالة التحقق من صلاحية الدخول للداشبورد
// ============================================
function checkDashboardAccess() {
    // تم إزالة أيقونة الداشبورد من الناف بار
    // الأدمن يتم توجيهه مباشرة بعد تسجيل الدخول
}


