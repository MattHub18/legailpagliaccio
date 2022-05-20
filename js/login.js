//register

const userRegisterInput = document.querySelector('#user-r');
const passwordRegisterInput = document.querySelector('#password-r');

async function registerUser(user, enc){
    const newUser = await firebase.database().ref('users/'+user).once('value');

    if(!newUser.exists()){

        firebase.database().ref("users/"+user).update({
            password: enc,
            coins: 0,
            expValue: 0,
            level: 1,
            teamName: "empty",
            teamLogo: ""
        }).then(()=>{

            firebase.database().ref("users/"+user+"/trophies").push().update({
                date: "No Trophies",
                type: "none"
            }).then(()=>{
                alert("register succesfully");

                userRegisterInput.value = '';
                passwordRegisterInput.value= '';
            });

        });
    }
    else
        alert("user already exist");
}

document.querySelector('.btn-r').addEventListener('click', () =>{
    const user = userRegisterInput.value;
    const password = passwordRegisterInput.value;

    var empty = false;

    empty = isEmpty(user, userRegisterInput, 'username');
    empty = isEmpty(password, passwordRegisterInput, 'password')

    if(empty) return;

    const enc = encrypt(password);

    registerUser(user, enc);
});

resetInput(userRegisterInput, 'username');
resetInput(passwordRegisterInput, 'password');

//login

const userLoginInput = document.querySelector('#user-l');
const passwordLoginInput = document.querySelector('#password-l');

document.querySelector('.btn-l').addEventListener('click', () =>{
    const user = userLoginInput.value;
    const password = passwordLoginInput.value;

    var empty = false;

    empty = isEmpty(user, userLoginInput, 'username');
    empty = isEmpty(password, passwordLoginInput, 'password')

    if(empty) return;


    firebase.database().ref('users/'+user).on('value', (snapshot)=>{
        if(snapshot.val() != null){
            const pswEnc = snapshot.val()['password'];
            if(decrypt(pswEnc)===password){
                setCookie(user);
                alert("login succesfully")
                location.replace("index.html");
            }
            else
                alert('wrong username/password');
        }
        else
            alert("user not exist")
    });
});

resetInput(userLoginInput, 'username');
resetInput(passwordLoginInput, 'password');

document.querySelector('.reset').addEventListener('click', ()=>{
    const username = userLoginInput.value;
    if(!isEmpty(username, userLoginInput, 'username')){
        firebase.database().ref("users/"+username).on('value', (snapshot)=>{
            const user = snapshot.val();
            if(user!=null){
                alert('Your password is: '+decrypt(user['password']));
            }
        });
    }
});
