let messages = JSON.parse(localStorage.getItem('messages')) || [];
let currentMessageId = null;

document.addEventListener('DOMContentLoaded', function() {
    renderMessages();
});

function renderMessages() {
    const tbody = document.getElementById('messagesTable');
    
    if (messages.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-secondary py-4">
                    لا توجد رسائل واردة.
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by date (newest first)
    const sortedMessages = [...messages].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tbody.innerHTML = sortedMessages.map(message => `
        <tr class="${!message.read ? 'table-warning' : ''}">
            <td class="text-white">${message.name}</td>
            <td class="text-secondary">${message.email}</td>
            <td class="text-secondary">${message.phone}</td>
            <td class="text-secondary">${message.subject}</td>
            <td class="text-secondary">${new Date(message.date).toLocaleDateString('ar-EG')}</td>
            <td>
                <span class="badge ${message.read ? 'bg-secondary' : 'bg-gold text-dark'}">
                    ${message.read ? 'مقروء' : 'جديد'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-gold me-2" onclick="viewMessage('${message.id}')">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMessage('${message.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewMessage(id) {
    const message = messages.find(m => m.id === id);
    if (!message) return;
    
    currentMessageId = id;
    message.read = true;
    localStorage.setItem('messages', JSON.stringify(messages));
    
    document.getElementById('messageDetails').innerHTML = `
        <div class="mb-3">
            <strong class="text-gold">الاسم:</strong>
            <p class="text-white">${message.name}</p>
        </div>
        <div class="mb-3">
            <strong class="text-gold">البريد الإلكتروني:</strong>
            <p class="text-white">${message.email}</p>
        </div>
        <div class="mb-3">
            <strong class="text-gold">الهاتف:</strong>
            <p class="text-white">${message.phone}</p>
        </div>
        <div class="mb-3">
            <strong class="text-gold">الموضوع:</strong>
            <p class="text-white">${message.subject}</p>
        </div>
        <div class="mb-3">
            <strong class="text-gold">الرسالة:</strong>
            <p class="text-white">${message.message}</p>
        </div>
        <div class="mb-3">
            <strong class="text-gold">التاريخ:</strong>
            <p class="text-white">${new Date(message.date).toLocaleString('ar-EG')}</p>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('messageModal'));
    modal.show();
    
    renderMessages();
}

function deleteMessage(id) {
    Swal.fire({
        icon: 'warning',
        title: 'هل أنت متأكد؟',
        text: 'هل أنت متأكد من حذف هذه الرسالة؟ لن يمكنك التراجع عن هذا الإجراء.',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            messages = messages.filter(m => m.id !== id);
            localStorage.setItem('messages', JSON.stringify(messages));
            renderMessages();
            Swal.fire({
                icon: 'success',
                title: 'تم الحذف!',
                text: 'تم حذف الرسالة بنجاح.',
                confirmButtonText: 'موافق',
                confirmButtonColor: '#ec9c04',
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
}

function markAllAsRead() {
    messages.forEach(m => m.read = true);
    localStorage.setItem('messages', JSON.stringify(messages));
    renderMessages();
}

function replyToMessage() {
    const message = messages.find(m => m.id === currentMessageId);
    if (message) {
        window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
    }
}

// Listen for new messages from contact form
window.addEventListener('storage', function(e) {
    if (e.key === 'messages') {
        messages = JSON.parse(e.newValue) || [];
        renderMessages();
    }
});

