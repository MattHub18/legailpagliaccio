const isEmpty = (input, placeholder)=>{
    input.placeholder = 'empty '+ placeholder;
    input.style = 'background-color: rgba(255,0,0,0.5);';
}

const resetInput = (input, placeholder) =>{
    input.addEventListener('focus', ()=> {
        input.placeholder = placeholder;
        input.style = 'background-color: #ddd;';
    });
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('user').addEventListener('click', () => {
        document.getElementById('toggler').click();
        document.getElementById('login').classList.toggle('active');
    });

    document.getElementById('login-close').addEventListener('click', () => {
        document.getElementById('login').classList.remove('active');
    });

    const username = document.getElementById('inputUsername');
    const password = document.getElementById('inputPassword');

    resetInput(username, 'username');
    resetInput(password, 'password');

    document.getElementById('btn').addEventListener('click', () => {
        let empty = false;

        if(username.value ===""){
            isEmpty(username, 'username');
            empty |= true;
        }

        if(password.value ===""){
            isEmpty(password, 'password');
            empty |= true;
        }

        if(empty) return;

        firebase.database().ref('admin').on('value', (snapshot)=>{
            const admin = snapshot.val();
            if(admin){
                const pswEnc = admin['password'];
                if(window.atob(pswEnc)===password.value){
                    location.replace("dashboard.html");
                    document.cookie = "admin=active";
                }
                else
                    alert('wrong username/password');
            }
        });
    });
});