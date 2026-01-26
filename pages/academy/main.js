// Load videos from localStorage or use default sample data
const defaultVideos = [
    {
        id: "vid-01",
        title: "كيف تختار ماكينة الليزر المناسبة؟",
        type: "tutorial",
        youtubeId: "dQw4w9WgXcQ",
        duration: "12:30"
    },
    {
        id: "vid-02",
        title: "شرح تشغيل ماكينة CO2",
        type: "tutorial",
        youtubeId: "dQw4w9WgXcQ",
        duration: "15:45"
    },
    {
        id: "vid-03",
        title: "إزاي زودنا إنتاج ورشة ألوميتال ٣ أضعاف",
        type: "testimonial",
        youtubeId: "dQw4w9WgXcQ",
        duration: "8:20"
    },
    {
        id: "vid-04",
        title: "جولة داخل خط تجميع ماكينات فوكاس ليزر",
        type: "factory",
        youtubeId: "dQw4w9WgXcQ",
        duration: "6:15"
    }
];

// Initialize videos in localStorage if empty
function initializeVideos() {
    const storedVideos = localStorage.getItem('videos');
    if (!storedVideos || JSON.parse(storedVideos).length === 0) {
        localStorage.setItem('videos', JSON.stringify(defaultVideos));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeVideos();
    renderVideos('tutorial', 'tutorials-container');
    renderVideos('testimonial', 'testimonials-container');
    renderVideos('factory', 'factory-container');
});

function renderVideos(type, containerId) {
    const container = document.getElementById(containerId);
    // Load from localStorage
    const allVideos = JSON.parse(localStorage.getItem('videos')) || defaultVideos;
    const filteredVideos = allVideos.filter(v => v.type === type);
    
    
    
    if (filteredVideos.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-video text-secondary" style="font-size: 4rem;"></i>
                <p class="text-secondary mt-3">لا توجد فيديوهات متاحة حالياً</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredVideos.map((video, index) => {
        // Generate unique ID for this instance
        const instanceId = `video-${type}-${index}`;
        
        // Extract YouTube ID if not already present (handling Dashboard data structure)
        let youtubeId = video.youtubeId;
        if (!youtubeId && video.url) {
            youtubeId = getYouTubeId(video.url);
        }
        
        // Helper function to extract ID inside the map if needed, 
        // but cleaner to use the standalone function below.
        
        // Handle Duration
        const durationHtml = video.duration ? 
            `<span class="video-duration" style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${video.duration}</span>` : 
            '';

        const durationInfoHtml = video.duration ? 
            `<span class="text-secondary small"><i class="fa-solid fa-clock me-1"></i> ${video.duration}</span>` :
            '';

        return `
        <div class="col-md-6 col-lg-4">
            <div class="video-card glass-card">
                <div class="video-thumbnail" id="${instanceId}">
                    <div class="thumbnail-wrapper" onclick="playVideo('${instanceId}', '${youtubeId}')" style="position: relative; cursor: pointer;">
                        <img src="https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg" alt="${video.title}" style="width: 100%; display: block;" onerror="this.src='../../images/logo.png'">
                        <div class="play-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(236, 156, 4, 0.8); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; transition: all 0.3s ease;">
                            <i class="fa-solid fa-play"></i>
                        </div>
                        ${durationHtml}
                    </div>
                </div>
                <div class="video-info p-3">
                    <h6 class="text-white mb-2">${video.title}</h6>
                    <div class="d-flex justify-content-between align-items-center">
                        ${durationInfoHtml}
                        <button class="btn btn-sm btn-outline-gold" onclick="playVideo('${instanceId}', '${youtubeId}')">
                            <i class="fa-solid fa-play me-1"></i> مشاهدة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
}

function getYouTubeId(url) {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
         videoId = url.split('embed/')[1]?.split('?')[0];
    }
    return videoId;
}

function playVideo(containerId, youtubeId) {
    const modalElement = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    
    if (modalElement && iframe) {
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Stop video when modal is closed
        modalElement.addEventListener('hidden.bs.modal', function () {
            iframe.src = '';
        });
    }
}

