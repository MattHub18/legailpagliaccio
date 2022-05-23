//comments

async function updateXpCoins(){
    const userRef = firebase.database().ref('users/'+username);
    const userA = await userRef.once('value');
    const user = userA.val();

    var xp = user['expValue'];
    var coins = user['coins'];
    var level = user['level'];
    const max = levels[level]['exp'];

    xp+=Math.floor(Math.random() * 2)+1;

    if(xp>=max){
        xp-=max;
        level++;
    }

    coins+=50;

    userRef.update({
        expValue: xp,
        coins: coins,
        level: level
    });
}

document.querySelector(".send").addEventListener('click',()=>{
    const commentArea = document.querySelector(".comment");
    const comment = commentArea.value;
    if(comment != ""){
        const el = document.querySelector(".carousel-item.active");
        if(el !=null)
            el.classList.toggle('active');
        firebase.database().ref('comments').push().set(comment);
        commentArea.value='';

        if(username!="")
            updateXpCoins();
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
        for (const [uname, user] of Object.entries(users)) {
            document.querySelector(`.username.u${index}`).innerHTML = uname;
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

//admin
isAdmin(username);
