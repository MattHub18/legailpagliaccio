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

    const username = document.getElementById('inputUsername');
    const password = document.getElementById('inputPassword');

    resetInput(username, 'username');
    resetInput(password, 'password');

    document.getElementById('btn').addEventListener('click', (e) => {
        e.preventDefault();
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
                    document.cookie = "admin=active";
                    location.replace("dashboard.html");
                }
                else
                    alert('wrong username/password');
            }
        });
    });
});
