//user->login

const userBtn = document.querySelector('.user');

firebase.database().ref('users/').on('value', (snapshot)=>{
    if(snapshot.val() != null){
        const username = getCookie('username');
        if(username!=""){
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

//comments

document.querySelector(".btn").addEventListener('click',()=>{
    const commentArea = document.querySelector(".comment");
    const comment = commentArea.value;
    if(comment != ""){
        const el = document.querySelector(".carousel-item.active");
        if(el !=null)
            el.classList.toggle('active');
        firebase.database().ref('comments').update({ [new Date().getTime()]: comment });
        commentArea.value='';
    }
});

const carInner = document.querySelector(".bl.carousel-inner");

function appendChildren(comment){
    var tagComment = document.createElement("p");
    tagComment.appendChild(document.createTextNode(comment));

    var car_item = document.createElement("div");
    car_item.className = "bl carousel-item";
    car_item.appendChild(tagComment);

    carInner.appendChild(car_item);
}

firebase.database().ref('comments').on('value', (snapshot)=>{
    carInner.innerHTML='';
    const comment = snapshot.val();
    if(comment != null){
        for (const [key, value] of Object.entries(comment)) {
            appendChildren(value);
        }
        document.querySelector(".bl.carousel-item").classList.toggle('active');
    }
});

//trophies

firebase.database().ref("users").on('value', (snapshot)=>{
    const users = snapshot.val();
    if(users!=null){
        var index = 0
        for (const [username, user] of Object.entries(users)) {
            document.querySelector(`.username.u${index}`).innerHTML = username;
            document.querySelector(`.team-name.tn${index}`).innerHTML = user['teamName'];
            document.querySelector(`.team-logo.tl${index}`).setAttribute("src", user['teamLogo']);

            const trophies = user['trophies'];
            for (const [key, value] of Object.entries(trophies)) {
                appendTrophies(value, document.querySelector(`.carousel-inner.el${index}`));
            }
            document.querySelector(`.carousel-inner.el${index} .carousel-item`).classList.toggle('active');
            index++;
        }

        //flipper

        document.querySelectorAll(".flipper").forEach((flipper)=>{
            flipper.addEventListener('click', ()=>{
                flipper.classList.toggle('flip');
            });
        });
    }
});


