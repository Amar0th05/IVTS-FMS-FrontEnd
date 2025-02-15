document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const mail = formData.get('mail');

        if (!mail) {
            showErrorPopupFadeInDown('Email is required.');
            return;
        }

        axiosInstance.post('/password/resetpassword/email', { mail })
            .then((response) => {
                showSucessPopupFadeInDownLong(response.data.message);
                if (response.data.message) {
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                }
            })
            .catch((error) => {
                showErrorPopupFadeInDown(error.response?.data?.message || 'Failed to send reset password email. Please try again later.');
            });
    });
});
