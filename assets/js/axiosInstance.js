const BASE_URL = 'http://localhost:3000';

const axiosInstance=axios.create({
    baseURL: BASE_URL,

});

axiosInstance.interceptors.request.use(
    (config)=>{
        if(!config.url.includes('login')&&!config.url.includes('register')){
            const token = sessionStorage.getItem('token');
            if(token){
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

// axiosInstance.interceptors.response.use(
//     (response)=>{
//         return response;
//     },
//     (error)=>{
//         if(error.response?.status === 401){
//             showErrorPopupFadeInDown('Session expired. please login again.');
//             setTimeout(() => {
//                 logout();
//             }, 1500);
//         }
//         return Promise.reject(error);
// });

function logout(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

window.logout = logout;
window.axiosInstance = axiosInstance;