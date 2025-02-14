const BASE_URL = 'http://localhost:3000';

const axiosInstance=axios.create({
    baseURL: BASE_URL,

});

axiosInstance.interceptors.request.use(
    (config)=>{
        if(!config.url.includes('login')&&!config.url.includes('register')){
            const token = localStorage.getItem('token');
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

function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

window.logout = logout;
window.axiosInstance = axiosInstance;