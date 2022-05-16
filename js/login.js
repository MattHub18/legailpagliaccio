const btnRegister = document.querySelector('.btn-r');

const userRegisterInput = document.getElementById('user-r');
const emailRegisterInput = document.getElementById('email-r');
const passwordRegisterInput = document.getElementById('password-r');

btnRegister.addEventListener('click', () =>{
    const usr = userRegisterInput.value;
    const email = emailRegisterInput.value;
    const password = passwordRegisterInput.value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
        const user = userCredential.user;
        user.updateProfile({displayName : usr});
    }).catch((error) => {
        if(usr ==""){
            userRegisterInput.placeholder = 'empty username';
            userRegisterInput.style = 'background-color: rgba(255,0,0,0.5);';
        }

        if(email ==""){
            emailRegisterInput.placeholder = 'empty email';
            emailRegisterInput.style = 'background-color: rgba(255,0,0,0.5);';
        }

        if(password ==""){
            passwordRegisterInput.placeholder = 'empty password';
            passwordRegisterInput.style = 'background-color: rgba(255,0,0,0.5);';
        }

        alert(error.message);
    });
    setTimeout(()=>{location.replace("index.html")}, 2000);
});

userRegisterInput.addEventListener('focus', ()=> {
    userRegisterInput.placeholder = 'username';
    userRegisterInput.style = 'background-color: #ddd;';
});

emailRegisterInput.addEventListener('focus', ()=> {
    emailRegisterInput.placeholder = 'email';
    emailRegisterInput.style = 'background-color: #ddd;';
});

passwordRegisterInput.addEventListener('focus', ()=> {
    passwordRegisterInput.placeholder = 'password';
    passwordRegisterInput.style = 'background-color: #ddd;';
});


const btnLogin = document.querySelector('.btn-l');

const emailLoginInput = document.getElementById('email-l');
const passwordLoginInput = document.getElementById('password-l');

btnLogin.addEventListener('click', () =>{
    const email = emailLoginInput.value;
    const password = passwordLoginInput.value;

    firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
        const user = userCredential.user;
    }).catch((error) => {
        if(user ==""){
            userLoginInput.placeholder = 'empty email';
            userLoginInput.style = 'background-color: rgba(255,0,0,0.5);';
        }

        if(pswLogin ==""){
            passwordLoginInput.placeholder = 'empty password';
            passwordLoginInput.style = 'background-color: rgba(255,0,0,0.5);';
        }
    });
    setTimeout(()=>{location.replace("index.html")}, 3000);
});

emailLoginInput.addEventListener('focus', ()=> {
    emailLoginInput.placeholder = 'email';
    emailLoginInput.style = 'background-color: #ddd;';
});

passwordLoginInput.addEventListener('focus', ()=> {
    passwordLoginInput.placeholder = 'password';
    passwordLoginInput.style = 'background-color: #ddd;';
});

const resetPassword = document.querySelector('.reset');

resetPassword.addEventListener('click', ()=>{
    const email = emailLoginInput.value;
    if(email !="")
        firebase.auth().sendPasswordResetEmail();
    else{
        emailLoginInput.placeholder = 'email required!';
        emailLoginInput.style = 'background-color: rgba(255,0,0,0.5);';
    }
});
