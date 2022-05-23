//user->login

const username = getCookie('username');

const userBtn = document.querySelector('.user');

firebase.database().ref('users/').on('value', (snapshot)=>{
    if(snapshot.val() != null){
        if(username!="" && !userBtn.classList.contains("active")){
            userBtn.innerHTML = '<i class="fas fa-user"></i>' + username;
            userBtn.classList.toggle('active');
            document.querySelector('.login').classList.remove('active');

            document.querySelector('.greetings').innerHTML = 'Ciao '+username+'!';
        }
    }
});

//user->sidenav

const sidenav = document.querySelector('.sidenav');

userBtn.addEventListener('click', ()=>{
    sidenav.classList.toggle('active');
    document.querySelector('.navbar-toggler').classList.toggle('collapsed');
    document.querySelector('.navbar-toggler').setAttribute('aria-expanded', false);
    document.querySelector('.navbar-collapse').classList.toggle('show');
});

document.querySelector('.close').addEventListener('click', ()=>{
    sidenav.classList.remove('active');
});

window.onscroll = () =>{
    sidenav.classList.remove('active');
}

document.querySelector('.logoutAction').addEventListener('click', ()=>{
    setCookie("")
    location.reload();
});
