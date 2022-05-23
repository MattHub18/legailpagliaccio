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

function makeCard(row, index){
    var flipper = document.createElement("div");
    flipper.className = "flipper col-xl-3 col-lg-6 col-md-6 col-sm-12";

    var teamCard = document.createElement("div");
    teamCard.className = "team-card";

    var front = document.createElement("div");
    front.className = "front";

    var teamLogo = document.createElement("img");
    teamLogo.className = `img-fluid team-logo tl${index}`;

    var teamName = document.createElement("h3");
    teamName.className = `team-name tn${index}`;

    var back = document.createElement("div");
    back.className = "back";

    var userName = document.createElement("h3");
    userName.className = `username u${index}`;

    var slide = document.createElement("div");
    slide.className = "carousel slide";
    slide.setAttribute("data-ride","carousel");
    slide.setAttribute("data-interval","2000");

    var slideInner = document.createElement("div");
    slideInner.className = `carousel-inner el${index}`;

    slide.appendChild(slideInner);
    back.appendChild(userName);
    back.appendChild(slide);
    front.appendChild(teamLogo);
    front.appendChild(teamName);
    teamCard.appendChild(front);
    teamCard.appendChild(back);
    flipper.appendChild(teamCard);
    row.appendChild(flipper);
    index++;

    $('.carousel').carousel()
}

firebase.database().ref("users").on('value', (snapshot)=>{
    const users = snapshot.val();
    if(users!=null){
        var index = 0
        const row = document.querySelector(".row");
        for (const [uname, user] of Object.entries(users)) {
            makeCard(row, index);
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
