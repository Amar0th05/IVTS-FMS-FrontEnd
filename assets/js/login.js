

// document.addEventListener('DOMContentLoaded', () => {
//     const token = localStorage.getItem('token1');
//     if (token) {
//         showPopupFadeInDown(`already logged in`);
//         document.querySelector("#login-form").remove(); 
//         setTimeout(() => {
//             window.location.href = 'index.html';
//         },1500);
//     }
//     const loginForm = document.getElementById('login-form');
//     loginForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);

//         const mail=formData.get('mail');
//         const password=formData.get('password');
//         const remember = document.getElementById('remember').checked ? 'true' : 'false';


//         try {
//             const response = await fetch('http://localhost:3000/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     mail: mail,
//                     password: password,
                
//                 })
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 const authHeader = response.headers.get('Authorization'); 
//                 const token = authHeader.split(' ')[1]; 
//                 localStorage.setItem('token', token1);
//                 showPopupFadeInDown(`Login Successful: ${localStorage.getItem('token1')}`);
//                 setTimeout(() => {
//                     window.location.href = 'index.html';
//                 },1000);
                
//             } else {
//                 const errorData = await response.json(); 
//                 showErrorPopupFadeInDown(errorData.message || 'Login failed. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             showErrorPopupFadeInDown('An unexpected error occurred. Please try again later.');
//         }
//         e.target.reset();
        
       
        
        
//     });
// });

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
            await axiosInstance.post('/login',{
                
                mail,
                password,
               
            }).then((response)=>{
                const authHeader = response.headers['authorization'];
                if(authHeader){
                    const token=authHeader.split(' ')[1];
                    localStorage.setItem('token', token);
                    showPopupFadeInDown(`Login Successful`);
                    setTimeout(() => {
                        window.location.href = 'index.html';
                },1000);
                }else{
                    showErrorPopupFadeInDown('Invalid credentials. Please try again.');
                }
                
            }).catch((error)=>{
                showErrorPopupFadeInDown(error.response.data.message || 'Login failed. Please try again.');
            });
            e.target.reset();

        }catch(error){
            console.error('Error:',error);
            showErrorPopupFadeInDown('An unexpected error occurred. Please try again later.');
        }
    });
     
});