document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            id: 'msg-' + Date.now(),
            name: form.querySelector('input[type="text"]').value,
            email: form.querySelector('input[type="email"]').value,
            phone: form.querySelector('input[type="tel"]').value,
            subject: form.querySelector('select').value,
            message: form.querySelector('textarea').value,
            date: new Date().toISOString(),
            read: false
        };
        
        // Save to localStorage
        let messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push(formData);
        localStorage.setItem('messages', JSON.stringify(messages));
        
        Swal.fire({
            icon: 'success',
            title: 'شكراً لك!',
            text: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
            confirmButtonText: 'موافق',
            confirmButtonColor: '#ec9c04',
            timer: 3000,
            timerProgressBar: true
        });
        form.reset();
    });
});

