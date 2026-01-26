// Default videos
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
    const stored = localStorage.getItem('videos');
    if (!stored || JSON.parse(stored).length === 0) {
        localStorage.setItem('videos', JSON.stringify(defaultVideos));
    }
}

// Load videos from localStorage
function loadVideos() {
    const stored = localStorage.getItem('videos');
    return stored ? JSON.parse(stored) : defaultVideos;
}

let videos = [];
let editingVideoId = null;
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    initializeVideos();
    videos = loadVideos();
    renderVideos();
});

function renderVideos() {
    const tbody = document.getElementById('videosTable');
    const filteredVideos = currentFilter === 'all' ? videos : videos.filter(v => v.type === currentFilter);
    
    if (filteredVideos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-secondary py-4">
                    لا توجد فيديوهات. اضغط على "إضافة فيديو جديد" للبدء.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredVideos.map(video => `
        <tr>
            <td class="text-white">${video.title}</td>
            <td><span class="badge bg-gold text-dark">${getTypeName(video.type)}</span></td>
            <td class="text-secondary">${video.youtubeId}</td>
            <td class="text-secondary">${video.duration || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-outline-gold me-2" onclick="editVideo('${video.id}')">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteVideo('${video.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getTypeName(type) {
    const names = {
        'tutorial': 'شروحات',
        'testimonial': 'آراء عملاء',
        'factory': 'من المصنع'
    };
    return names[type] || type;
}

function filterVideos(type) {
    currentFilter = type;
    document.querySelectorAll('.nav-pills .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    renderVideos();
}

function saveVideo() {
    const form = document.getElementById('videoForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Reload videos to ensure we have latest data
    videos = loadVideos();
    
    const videoData = {
        id: editingVideoId || 'video-' + Date.now(),
        title: document.getElementById('videoTitle').value,
        type: document.getElementById('videoType').value,
        youtubeId: document.getElementById('videoYoutubeId').value,
        duration: document.getElementById('videoDuration').value
    };
    
    if (editingVideoId) {
        const index = videos.findIndex(v => v.id === editingVideoId);
        if (index !== -1) {
            videos[index] = videoData;
        }
    } else {
        videos.push(videoData);
    }
    
    localStorage.setItem('videos', JSON.stringify(videos));
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addVideoModal'));
    modal.hide();
    
    form.reset();
    editingVideoId = null;
    document.getElementById('modalTitle').textContent = 'إضافة فيديو جديد';
    
    renderVideos();
    
    // Show success message
    Swal.fire({
        icon: 'success',
        title: 'تم الحفظ بنجاح!',
        text: 'تم حفظ الفيديو بنجاح.',
        confirmButtonText: 'موافق',
        confirmButtonColor: '#ec9c04',
        timer: 2000,
        timerProgressBar: true
    });
}

function editVideo(id) {
    const video = videos.find(v => v.id === id);
    if (!video) return;
    
    editingVideoId = id;
    document.getElementById('videoId').value = video.id;
    document.getElementById('videoTitle').value = video.title;
    document.getElementById('videoType').value = video.type;
    document.getElementById('videoYoutubeId').value = video.youtubeId;
    document.getElementById('videoDuration').value = video.duration || '';
    document.getElementById('modalTitle').textContent = 'تعديل الفيديو';
    
    const modal = new bootstrap.Modal(document.getElementById('addVideoModal'));
    modal.show();
}

function deleteVideo(id) {
    Swal.fire({
        icon: 'warning',
        title: 'هل أنت متأكد؟',
        text: 'هل أنت متأكد من حذف هذا الفيديو؟ لن يمكنك التراجع عن هذا الإجراء.',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            videos = loadVideos(); // Reload to ensure latest data
            videos = videos.filter(v => v.id !== id);
            localStorage.setItem('videos', JSON.stringify(videos));
            renderVideos();
            Swal.fire({
                icon: 'success',
                title: 'تم الحذف!',
                text: 'تم حذف الفيديو بنجاح.',
                confirmButtonText: 'موافق',
                confirmButtonColor: '#ec9c04',
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
}

document.getElementById('addVideoModal').addEventListener('hidden.bs.modal', function() {
    document.getElementById('videoForm').reset();
    editingVideoId = null;
    document.getElementById('modalTitle').textContent = 'إضافة فيديو جديد';
});

