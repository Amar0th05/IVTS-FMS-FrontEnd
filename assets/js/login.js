
document.addEventListener('DOMContentLoaded',()=>{
    const token = localStorage.getItem('token');
    if(token){
        showPopupFadeInDown(`already logged in`);
        document.querySelector("#login-form").remove(); 
        setTimeout(() => {
            window.location.href = 'index.html';
        },1500);
    }
    
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit',async (e)=>{
        e.preventDefault();
        const loginData=new FormData(e.target);
        const mail=loginData.get('mail');
        const password=loginData.get('password');
        const remember=document.getElementById('remember').checked? 'true' : 'false';

        try{
            await axiosInstance.post('/auth/login',{
                
                mail,
                password,
               
            }).then((response)=>{
                const authHeader = response.headers['authorization'];
                if(authHeader){
                    const token=authHeader.split(' ')[1];
                    localStorage.setItem('token', token);
                    showPopupFadeInDown(`Login Successful`);
                    e.target.reset();
                    setTimeout(() => {
                        window.location.href = 'index.html';
                },1000);
                }else{
                    showErrorPopupFadeInDown('Invalid credentials. Please try again.');
                }
                
            }).catch((error)=>{
                showErrorPopupFadeInDown(error.response.data.message || 'Login failed. Please try again.');
            });
           

        }catch(error){
            console.error('Error:',error);
            showErrorPopupFadeInDown('An unexpected error occurred. Please try again later.');
        }
    });
     
});