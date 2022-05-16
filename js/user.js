const userBtn = document.querySelector('.user');

firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        userBtn.innerHTML = '<i class="fas fa-user"></i>' + firebase.auth().currentUser.displayName;
        userBtn.classList.toggle('active');
        document.querySelector('.login').classList.remove('active');

        document.querySelector('.greetings').innerHTML = 'Ciao '+firebase.auth().currentUser.displayName+'!';
    }
});

const sidenav = document.querySelector('.sidenav');

userBtn.addEventListener('click', ()=>{
    sidenav.classList.toggle('active');
});

const closeSidenav = document.querySelector('.close');

closeSidenav.addEventListener('click', ()=>{
    sidenav.classList.remove('active');
});

window.onscroll = () =>{
    sidenav.classList.remove('active');
}

const logoutAction = document.querySelector('.logoutAction');

logoutAction.addEventListener('click', ()=>{
    firebase.auth().signOut();
    setTimeout(()=>{location.reload();},2000);
});
