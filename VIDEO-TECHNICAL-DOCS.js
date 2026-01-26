// ============================================================================
// VIDEO SYSTEM - COMPLETE DOCUMENTATION
// إدارة نظام الفيديوهات - التوثيق الكامل
// ============================================================================

/*
 * FILE: pages/dashboard/main.js
 * PURPOSE: Handle all video management operations
 * VERSION: 1.0
 * LAST UPDATE: 2026-01-17
 */

// ============================================================================
// 1. GLOBAL VARIABLES
// ============================================================================

let currentVideoId = null;      // Track which video is being edited
let videosData = [];            // Store all videos from localStorage

// ============================================================================
// 2. MAIN FUNCTIONS
// ============================================================================

/**
 * loadVideosTable()
 * LOCATION: pages/dashboard/main.js:490-521
 * 
 * PURPOSE:
 *   - Display all videos as responsive grid cards
 *   - Show embedded video player in each card
 *   - Add edit and delete buttons
 * 
 * FLOW:
 *   1. Get videosTableBody container
 *   2. Check if videos exist (show message if empty)
 *   3. Create cards for each video:
 *      ├─ Embedded video via getVideoEmbed()
 *      ├─ Video title and type badge
 *      └─ Edit and Delete buttons
 *   4. Render as responsive grid (col-md-6 col-lg-4)
 * 
 * EXAMPLE OUTPUT:
 *   <div class="row">
 *     <div class="col-md-6 col-lg-4">
 *       <div class="card">
 *         <div style="position: relative; padding-bottom: 56.25%; ...">
 *           <iframe ...></iframe>
 *         </div>
 *         <div class="card-body">...</div>
 *       </div>
 *     </div>
 *   </div>
 */
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

/**
 * resetVideoForm()
 * LOCATION: pages/dashboard/main.js:523-526
 * 
 * PURPOSE:
 *   - Clear the video form
 *   - Reset modal title to "إضافة فيديو"
 *   - Reset edit mode
 * 
 * TRIGGERED BY:
 *   - Click "إضافة فيديو" button
 *   - Close modal after save
 */
function resetVideoForm() {
    document.getElementById('videoForm').reset();
    document.getElementById('videoModalTitle').textContent = 'إضافة فيديو';
    currentVideoId = null;
}

/**
 * saveVideo()
 * LOCATION: pages/dashboard/main.js:529-577
 * 
 * PURPOSE:
 *   - Validate form inputs
 *   - Extract thumbnail automatically
 *   - Save video to localStorage
 *   - Update display
 * 
 * VALIDATION:
 *   - Title (required)
 *   - Type (required)
 *   - URL (required)
 * 
 * FLOW:
 *   1. Get form values
 *   2. Validate all required fields
 *   3. Call getVideoThumbnail() to extract image
 *   4. Create video object
 *   5. Add to videosData or update existing
 *   6. Save to localStorage
 *   7. Show success message
 *   8. Hide modal
 *   9. Reset form
 *   10. Reload table
 * 
 * DATA STRUCTURE:
 *   {
 *     id: "123456789",
 *     title: "Video Title",
 *     type: "tutorial",
 *     url: "https://youtube.com/watch?v=...",
 *     image: "https://img.youtube.com/vi/.../hqdefault.jpg"
 *   }
 */
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

// ============================================================================
// 3. HELPER FUNCTIONS
// ============================================================================

/**
 * getVideoThumbnail(url)
 * LOCATION: pages/dashboard/main.js:579-607
 * 
 * PURPOSE:
 *   - Extract video ID from URL
 *   - Generate thumbnail image URL
 *   - Support YouTube and Vimeo
 * 
 * INPUT FORMATS:
 *   YouTube: https://youtube.com/watch?v=abc123
 *   YouTube: https://youtu.be/abc123
 *   Vimeo: https://vimeo.com/123456
 * 
 * LOGIC:
 *   1. Check if URL contains YouTube domain
 *   2. Extract video ID based on format
 *   3. Return YouTube thumbnail URL
 *   4. Check if URL contains Vimeo domain
 *   5. Return Vimeo API URL
 *   6. Return empty string if no match
 * 
 * RETURNS:
 *   YouTube: "https://img.youtube.com/vi/{id}/hqdefault.jpg"
 *   Vimeo: "https://vimeo.com/api/v2/video/{id}.json"
 *   Other: ""
 * 
 * EXAMPLE:
 *   INPUT: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *   EXTRACT: "dQw4w9WgXcQ"
 *   OUTPUT: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
 */
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
            return `https://vimeo.com/api/v2/video/${videoId}.json`;
        }
    }
    
    return '';
}

/**
 * getVideoEmbed(url)
 * LOCATION: pages/dashboard/main.js:609-631
 * 
 * PURPOSE:
 *   - Convert video URL to embedded iframe
 *   - Make video responsive (16:9 aspect ratio)
 *   - Support YouTube and Vimeo
 * 
 * RESPONSIVE TECHNIQUE:
 *   - Parent: position relative, padding-bottom 56.25%
 *   - Child (iframe): position absolute, 100% width/height
 *   - Maintains 16:9 ratio (56.25% = 9/16)
 * 
 * HTML OUTPUT:
 *   YouTube:
 *     <iframe style="position: absolute; ..."
 *             src="https://www.youtube.com/embed/{id}">
 *     </iframe>
 *   
 *   Vimeo:
 *     <iframe style="position: absolute; ..."
 *             src="https://vimeo.com/{id}">
 *     </iframe>
 * 
 * ATTRIBUTES:
 *   - position: absolute (for responsive sizing)
 *   - top: 0, left: 0 (align to container)
 *   - width: 100%, height: 100% (fill container)
 *   - frameborder: 0 (no borders)
 *   - allow: various permissions
 *   - allowfullscreen: enable fullscreen mode
 */
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
            return `<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
        return `<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="${url}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    }
    
    return '<div style="padding: 20px; background: #f0f0f0; text-align: center; color: #999; height: 100%; display: flex; align-items: center; justify-content: center;">فيديو غير متاح</div>';
}

/**
 * editVideo(index)
 * LOCATION: pages/dashboard/main.js:633-642
 * 
 * PURPOSE:
 *   - Load video data into form
 *   - Set edit mode
 *   - Show modal for editing
 * 
 * PARAMETERS:
 *   index: array index of video to edit
 * 
 * PROCESS:
 *   1. Set currentVideoId to track edit mode
 *   2. Get video from videosData array
 *   3. Populate form fields
 *   4. Change modal title to "تعديل فيديو"
 *   5. Show modal
 * 
 * TRIGGERED BY:
 *   - Click "تعديل" button on video card
 */
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

/**
 * deleteVideo(index)
 * LOCATION: pages/dashboard/main.js
 * 
 * PURPOSE:
 *   - Remove video from storage
 *   - Refresh display
 * 
 * PROCESS:
 *   1. Show confirmation dialog
 *   2. If confirmed:
 *      ├─ Remove from array
 *      ├─ Save to localStorage
 *      └─ Refresh table
 */
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
            Swal.fire('تم الحذف', 'تم حذف الفيديو بنجاح', 'success');
            loadVideosTable();
            loadAllData();
        }
    });
}

// ============================================================================
// 4. RESPONSIVE DESIGN CSS
// ============================================================================

/*
 * VIDEO CARD RESPONSIVE BREAKPOINTS:
 * 
 * Mobile (< 768px):
 *   col-12 (full width)
 *   1 video per row
 * 
 * Tablet (768px - 992px):
 *   col-md-6 (half width)
 *   2 videos per row
 * 
 * Desktop (> 992px):
 *   col-lg-4 (one-third width)
 *   3 videos per row
 * 
 * ASPECT RATIO CALCULATION:
 * 
 * Desired: 16:9
 * Ratio: 9 ÷ 16 = 0.5625 = 56.25%
 * 
 * CSS:
 *   <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
 *     <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
 *   </div>
 */

// ============================================================================
// 5. DATA STRUCTURE
// ============================================================================

/*
 * SINGLE VIDEO OBJECT:
 * 
 * {
 *   id: "1234567890",           // Unique identifier (timestamp)
 *   title: "فيديو اختبار",      // Video title
 *   type: "tutorial",            // Type: tutorial | testimonial | factory
 *   url: "https://...",          // YouTube/Vimeo URL
 *   image: "https://img.youtube..." // Thumbnail (auto-generated)
 * }
 * 
 * STORAGE:
 *   Location: browser localStorage
 *   Key: 'videos'
 *   Format: JSON array
 *   Access: JSON.parse(localStorage.getItem('videos'))
 */

// ============================================================================
// 6. SUPPORTED PLATFORMS
// ============================================================================

/*
 * YOUTUBE FORMATS:
 * ├─ Standard: https://www.youtube.com/watch?v={ID}
 * ├─ Alternate: https://youtube.com/watch?v={ID}
 * ├─ Short URL: https://youtu.be/{ID}
 * └─ With params: https://youtu.be/{ID}?t=10
 * 
 * VIMEO FORMAT:
 * └─ https://vimeo.com/{ID}
 * 
 * EXTRACT LOGIC:
 * ├─ YouTube v1: split('v=')[1].split('&')[0]
 * ├─ YouTube v2: split('youtu.be/')[1].split('?')[0]
 * └─ Vimeo: split('/').pop().split('?')[0]
 */

// ============================================================================
// 7. TROUBLESHOOTING
// ============================================================================

/*
 * ISSUE: Video not displaying
 * SOLUTION:
 *   1. Check URL format (YouTube or Vimeo)
 *   2. Ensure video is public (not private)
 *   3. Check browser console for errors
 *   4. Verify URL has no extra spaces
 * 
 * ISSUE: Thumbnail not showing
 * SOLUTION:
 *   1. YouTube is auto-generated (should always work)
 *   2. Vimeo may need API access (fallback available)
 * 
 * ISSUE: Form not saving
 * SOLUTION:
 *   1. Check all three fields are filled
 *   2. Check browser localStorage is enabled
 *   3. Check browser console for JavaScript errors
 */

// ============================================================================
// END OF DOCUMENTATION
// ============================================================================
