const BASE_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

let isLoggingOut = false;

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');

        if (!config.url.includes('login') && !config.url.includes('register')) {
            if (isTokenExpired()) {
                handleSessionExpiry();
                return Promise.reject(new Error('Session expired. Please login again.'));
            }
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            handleSessionExpiry();
        }
        return Promise.reject(error);
    }
);

function handleSessionExpiry() {
    if (!isLoggingOut) {
        isLoggingOut = true;
        showErrorPopupFadeInDown('Session expired. Please login again.');
        setTimeout(logout, 1500);
    }
}

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

function isTokenExpired() {
    const token = sessionStorage.getItem('token');
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch (error) {
        return true;
    }
}


if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
    setInterval(() => {
        if (isTokenExpired()) {
            handleSessionExpiry();
        }
    }, 10000);
}

window.logout = logout;
window.axiosInstance = axiosInstance;
