//tabs

function openTab(tab) {
    document.querySelectorAll(".tabcontent").forEach((tabContent)=>{
        tabContent.classList.remove('active');
    });

    document.querySelectorAll(".tablinks").forEach((tabLink)=>{
        tabLink.classList.remove('active');
    });

    document.querySelectorAll(tab).forEach((tabActive)=>{
        tabActive.classList.toggle('active');
    });
}

openTab('.data');

//data tab

const usernameInput = document.querySelector('.username');
const passwordInput = document.querySelector('.password');
const teamnameInput = document.querySelector('.teamname');

firebase.database().ref("users/"+username).on('value',(snapshot)=>{
    const user = snapshot.val();
    if(user!=null){
        var l = user['level'];
        var e = user['expValue'];
        document.querySelector('.name').innerText = username;
        document.querySelector(".user-logo").setAttribute("src", user['userLogo']);
        document.querySelector('.level').innerText = l;
        document.querySelector('.value').innerText = e;
        const lvl = levels[l];
        const ex = lvl['exp'];
        document.querySelector('.max-value').innerText = ex;
        document.querySelector('.xp-bar-active').style.width = (e / ex *100).toString()+'%';

        document.querySelector('.user-title').innerText = lvl['title'];
        document.querySelector('.coins').innerHTML = user['coins'] +'<i class="fas fa-coins"></i>';

        usernameInput.value = username;
        passwordInput.value = decrypt(user['password']);
        teamnameInput.value = user['teamName'];
    }
});

const eye = document.querySelector('.eye');

eye.addEventListener('click', ()=>{
    var type = eye.classList.contains('fa-eye-slash') ? 'text' : 'password';
    passwordInput.setAttribute('type', type)
    eye.classList.toggle('fa-eye-slash');
});

async function readUser(user, enc, teamname){
    const oldUserRef =  await firebase.database().ref("users/"+getCookie("username")).once('value');
    const oldUser = oldUserRef.val()

    const coins = oldUser['coins'];
    const expValue = oldUser['expValue'];
    const level = oldUser['level'];
    const trophies = oldUser['trophies'];
    const teamlogo = oldUser['teamLogo'];
    const userlogo = oldUser['userLogo'];
    const admin = oldUser['admin'];

    firebase.database().ref("users/"+getCookie("username")).remove();

    firebase.database().ref("users/"+user).update({
        password: enc,
        coins: coins,
        expValue: expValue,
        level: level,
        trophies: trophies,
        teamName: teamname,
        teamLogo: teamlogo,
        userLogo: userlogo,
        admin: admin
    });

    setCookie(user);

    alert("update succesfully");

    location.reload();
}

document.querySelector('.btn').addEventListener('click', () =>{
    const user = usernameInput.value;
    const password = passwordInput.value;
    const teamname = teamnameInput.value;

    var empty = false;

    empty = isEmpty(user, usernameInput, 'username');
    empty = isEmpty(password, passwordInput, 'password')
    empty = isEmpty(teamname, teamnameInput, 'squadra')

    if(empty) return;

    const enc = encrypt(password);

    readUser(user, enc, teamname);
});

resetInput(usernameInput, 'username');
resetInput(passwordInput, 'password');

//trophies

firebase.database().ref('users/'+username+"/trophies").on('value', (snapshot)=>{
    const selector = document.querySelector(".carousel-inner");
    selector.innerHTML='';
    const trophies = snapshot.val();
    if(trophies != null){
        for (const [key, value] of Object.entries(trophies)) {
            appendTrophies(value, selector);
        }
        document.querySelector(".carousel-item").classList.toggle('active');
    }
});

//customs

const elementPerTab = 12;

firebase.storage().ref("img/customs").listAll().then((list)=>{
    var size = list.items.length;
    let tab;
    if(size>0){
        tab  = Math.floor(size/elementPerTab);
        if(size%12!=0)
            tab++;

        const carouselInner = document.querySelector(".customs-inner");
        const carouselIndicator = document.querySelector(".carousel-indicators");

        for(var t=0; t<tab; t++){
            var carouselItem = document.createElement("div");
            carouselItem.className = "carousel-item";

            var row = document.createElement("div");
            row.className = "row";

            for(var e=0; e <elementPerTab; e++){
                var element = document.createElement("div");
                element.className = "element col-xl-3 col-lg-3 col-md-4 col-sm-6";

                var imgContainer = document.createElement("div");
                imgContainer.className = "img-container";

                var img = document.createElement("img");
                img.className = `img${t}${e}`;

                var button = document.createElement("button");
                button.className = "btn hover";
                button.setAttribute("id", `btn${e}`);
                button.setAttribute("type", "button");
                button.innerHTML = "100<i class=\"fas fa-coins\"></i>";
                disableButton(button);

                var desc = document.createElement("p");
                desc.innerText = "maglia";

                var hline = document.createElement("div");
                hline.className = "hline";

                imgContainer.appendChild(img);
                imgContainer.appendChild(button);
                element.appendChild(imgContainer);
                element.appendChild(desc);
                element.appendChild(hline);
                row.appendChild(element);
            }

            carouselItem.appendChild(row);

            carouselInner.appendChild(carouselItem);

            var indicator = document.createElement("li");
            indicator.setAttribute("data-target",".customs-slide");
            indicator.setAttribute("data-slide-to",t.toString());
            carouselIndicator.appendChild(indicator);
        }
    }
});

async function sorting(img, url){
    const imgPath = await img.getMetadata();
    const np= imgPath.fullPath.split("-");
    var t=parseInt(np[0].match(/(\d+)/));
    var e=parseInt(np[1].match(/(\d+)/));
    document.querySelector(`.img${t}${e}`).setAttribute("src", url);
}

firebase.storage().ref("img/customs").listAll().then((list)=>{
    document.querySelector(".customs-inner .carousel-item").classList.toggle('active');
    document.querySelector(".carousel-indicators li").classList.toggle('active');

    list.items.forEach((img)=>{
        img.getDownloadURL().then(function(url) {
            sorting(img, url)
        });
    });

    document.querySelectorAll(".hover").forEach((button, index)=>{
        button.addEventListener('click', ()=>{
            var value = parseInt(button.innerHTML.match(/(\d+)/));
            var cost = !isNaN(value) ? value : 0;
            transaction(button, cost);
        });
    });
});

//user img

async function transaction(button, cost){
    const user = await firebase.database().ref("users/"+username).once('value');
    var coins = user.val()['coins'];
    if(coins-cost>=0){
        coins-=cost;
        const url = button.parentNode.children[0].getAttribute("src");
        firebase.database().ref("users/"+username).update({
            coins: coins,
            userLogo: url
        });
        const btnId = button.getAttribute("id");
        firebase.database().ref("users/"+username+"/customs").update({[btnId]:btnId});
        disableButton(button);
    }else
        alert('you can not purchase this item');
}

async function disableButton(button){
    const customRef = await firebase.database().ref("users/"+username+"/customs").once('value');
    const customVal = customRef.val();
    if(customVal!=null){
        const customs = Object.values(customVal);
        if(customs.includes(button.getAttribute("id")))
            button.innerHTML = "Scegli";
    }
}

//admin
isAdmin(username);
