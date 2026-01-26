// Testimonials Data
const testimonialsData = [
    {
        id: 1,
        clientName: "محمد علي",
        company: "شركة الصناعة المتقدمة",
        type: "fiber",
        videoId: "dQw4w9WgXcQ",
        rating: 5,
        text: "ماكينة الليزر الفايبر المذهلة! زادت إنتاجيتنا بنسبة 300% في الشهر الأول. الجودة ممتازة والدعم الفني لا يُقدر بثمن.",
        avatar: "👨‍💼"
    },
    {
        id: 2,
        clientName: "فاطمة محمود",
        company: "مصنع الأعمال المعدنية",
        type: "co2",
        videoId: "dQw4w9WgXcQ",
        rating: 5,
        text: "استثمار حكيم جداً! ماكينة CO2 متينة جداً وسهلة الاستخدام. الفريق الفني ساعدنا في التدريب بشكل احترافي.",
        avatar: "👩‍💼"
    },
    {
        id: 3,
        clientName: "أحمد سالم",
        company: "مشغل الحفر والنقش",
        type: "uv",
        videoId: "dQw4w9WgXcQ",
        rating: 5,
        text: "ليزر UV رائع لأعمالنا في النقش الدقيق. الدقة عالية جداً والموثوقية ممتازة. أنصح بشدة!",
        avatar: "👨‍🔧"
    },
    {
        id: 4,
        clientName: "ليلى محمد",
        company: "استديو التصميم والحفر",
        type: "fiber",
        videoId: "dQw4w9WgXcQ",
        rating: 5,
        text: "منذ شراء ماكينة الفايبر من فوكاس، تضاعفت أرباحنا! العملاء يحبون جودة العمل العالية جداً.",
        avatar: "👩‍🎨"
    },
    {
        id: 5,
        clientName: "خالد عبدالله",
        company: "مصنع الألومنيوم والمعادن",
        type: "co2",
        videoId: "dQw4w9WgXcQ",
        rating: 5,
        text: "تجربة رائعة من البداية. الماكينة قوية وموثوقة. الدعم الفني سريع جداً والأسعار معقولة.",
        avatar: "👨‍🏭"
    },
    {
        id: 6,
        clientName: "نور الدين",
        company: "ورشة الحرف اليدوية",
        type: "uv",
        videoId: "dQw4w9WgXcQ",
        rating: 5,
        text: "ماكينة ليزر UV ممتازة للأعمال الفنية. النتائج احترافية جداً وسهلة التشغيل والصيانة بسيطة.",
        avatar: "👨‍🎓"
    }
];

// Load Footer
document.addEventListener('DOMContentLoaded', function() {
    loadFooter();
    loadTestimonials();
    setupFilterButtons();
    checkDashboardAccess();
    updateStats();
});

// Load Footer from Component
function loadFooter() {
    fetch('../../components/footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footerContainer').innerHTML = html;
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Load Testimonials from localStorage or use default
function loadTestimonials() {
    let testimonials = JSON.parse(localStorage.getItem('testimonials'));
    
    if (!testimonials || testimonials.length === 0) {
        testimonials = testimonialsData;
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
    }
    
    renderTestimonials(testimonials);
}

// Render Testimonials
function renderTestimonials(testimonials, filter = 'all') {
    const grid = document.getElementById('testimonialsGrid');
    grid.innerHTML = '';
    
    let filtered = testimonials;
    if (filter !== 'all') {
        filtered = testimonials.filter(t => t.type === filter);
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-12"><p class="text-center text-secondary">لا توجد شهادات للنوع المحدد</p></div>';
        return;
    }
    
    filtered.forEach((testimonial, index) => {
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const typeLabel = {
            'fiber': 'ليزر فايبر',
            'co2': 'ليزر CO2',
            'uv': 'ليزر UV'
        }[testimonial.type];
        
        const stars = Array(testimonial.rating).fill('<i class="fa-solid fa-star star"></i>').join('');
        
        card.innerHTML = `
            <div class="testimonial-card">
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${testimonial.videoId}?rel=0" 
                            allowfullscreen="" 
                            loading="lazy">
                    </iframe>
                </div>
                <div class="testimonial-content">
                    <div class="testimonial-header">
                        <div class="client-avatar">${testimonial.avatar}</div>
                        <div class="client-info">
                            <h4>${testimonial.clientName}</h4>
                            <p>${testimonial.company}</p>
                        </div>
                    </div>
                    <span class="testimonial-type">
                        <i class="fa-solid fa-tag me-1"></i>${typeLabel}
                    </span>
                    <p class="testimonial-text">${testimonial.text}</p>
                    <div class="testimonial-rating">
                        ${stars}
                    </div>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Setup Filter Buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const testimonials = JSON.parse(localStorage.getItem('testimonials')) || testimonialsData;
            renderTestimonials(testimonials, filter);
        });
    });
}

// Update Statistics
function updateStats() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || testimonialsData;
    
    const total = testimonials.length;
    const fiberCount = testimonials.filter(t => t.type === 'fiber').length;
    const co2Count = testimonials.filter(t => t.type === 'co2').length;
    const uvCount = testimonials.filter(t => t.type === 'uv').length;
    
    document.getElementById('totalTestimonials').textContent = total;
    document.getElementById('fiberCount').textContent = fiberCount;
    document.getElementById('co2Count').textContent = co2Count;
    document.getElementById('uvCount').textContent = uvCount;
}

// Check Dashboard Access (copy from main.js)
function checkDashboardAccess() {
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        const userToken = localStorage.getItem('userToken');
        const userRole = localStorage.getItem('userRole');
        
        if (userToken && userRole === 'admin') {
            dashboardLink.style.display = 'inline-block';
        } else {
            dashboardLink.style.display = 'none';
        }
    }
}
