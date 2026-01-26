// SweetAlert2 Configuration for RTL Arabic
const SwalConfig = {
    confirmButtonText: 'موافق',
    cancelButtonText: 'إلغاء',
    confirmButtonColor: '#ec9c04',
    cancelButtonColor: '#6c757d',
    allowOutsideClick: false,
    allowEscapeKey: true,
    reverseButtons: true
};

// Helper function for success messages
function showSuccess(title, text = '') {
    return Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonText: 'موافق',
        confirmButtonColor: '#ec9c04',
        timer: 2000,
        timerProgressBar: true
    });
}

// Helper function for error messages
function showError(title, text = '') {
    return Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonText: 'موافق',
        confirmButtonColor: '#dc3545'
    });
}

// Helper function for warning messages
function showWarning(title, text = '') {
    return Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        confirmButtonText: 'موافق',
        confirmButtonColor: '#ec9c04'
    });
}

// Helper function for confirm dialogs
function showConfirm(title, text = '', confirmText = 'نعم، متأكد', cancelText = 'إلغاء') {
    return Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        reverseButtons: true
    });
}

// Helper function for info messages
function showInfo(title, text = '') {
    return Swal.fire({
        icon: 'info',
        title: title,
        text: text,
        confirmButtonText: 'موافق',
        confirmButtonColor: '#ec9c04'
    });
}

