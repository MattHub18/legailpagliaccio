function openTab(tab) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    const tablinks = document.getElementsByClassName("tablinks");

    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove('active');
    }

    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }

    document.getElementsByClassName("tabcontent "+tab)[0].classList.toggle('active');
    document.getElementsByClassName("tablinks "+tab)[0].classList.toggle('active');
}

openTab('data');

const usernameInput = document.querySelector('.username');
const emailInput = document.querySelector('.email');
const btn = document.querySelector('.btn');

firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        var name = document.querySelector(".name");
        name.innerText = user.displayName;
        usernameInput.value = user.displayName;
        emailInput.innerText = user.email;
    }
});

btn.addEventListener('click', ()=>{
    const username = usernameInput.value;

    firebase.auth().onAuthStateChanged((user)=>{
        user.updateProfile({displayName : username});
        setTimeout(()=>{location.reload();},2000);
    });
});
