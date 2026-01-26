function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            // Simple authentication (in production, use proper backend)
            // For demo: admin@focus-laser.com / admin123
            if (email === 'admin@focus-laser.com' && password === 'admin123') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('userToken', 'admin-token-' + Date.now());
                Swal.fire({
                    icon: 'success',
                    title: 'تم تسجيل الدخول بنجاح!',
                    text: 'جاري التوجيه إلى لوحة التحكم...',
                    confirmButtonText: 'موافق',
                    confirmButtonColor: '#ec9c04',
                    timer: 1500,
                    timerProgressBar: true
                }).then(() => {
                    window.location.href = '../dashboard/index.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ في تسجيل الدخول',
                    text: 'البريد الإلكتروني أو كلمة المرور غير صحيحة!',
                    confirmButtonText: 'موافق',
                    confirmButtonColor: '#dc3545'
                });
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'كلمات المرور غير متطابقة!',
                    confirmButtonText: 'موافق',
                    confirmButtonColor: '#dc3545'
                });
                return;
            }
            
            // Here you would normally send the form data to a server
            Swal.fire({
                icon: 'success',
                title: 'تم إنشاء الحساب بنجاح!',
                text: 'يمكنك الآن تسجيل الدخول.',
                confirmButtonText: 'موافق',
                confirmButtonColor: '#ec9c04',
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                window.location.href = 'login.html';
            });
        });
    }
});

