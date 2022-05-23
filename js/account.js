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

//drag n drop

function handleFile(file){
    let downloadUrl;
    const storage = firebase.storage().ref("img/teams/"+file.name);
    const uploadTask = storage.put(file);
    uploadTask.on('state_changed',null,null,()=>{
        uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl)=>{
           firebase.database().ref("users/"+username).update({
               teamLogo: downloadUrl
           });
            alert('logo changed succesfully');
            document.getElementById("fileUpload").value = "";
        });
    });

}

const dropArea = document.querySelector('.drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e)=>{
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, ()=>{dropArea.classList.add('highlight');}, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, ()=>{dropArea.classList.remove('highlight');}, false);
});

dropArea.addEventListener('drop', (e)=>{handleFile(e.dataTransfer.file);}, false);

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
    }else
        alert('you can not purchase this item');
}


document.querySelectorAll(".hover").forEach((button)=>{
    button.addEventListener('click', ()=>{
        var cost = parseInt(button.innerHTML.match(/(\d+)/)[0]);
        transaction(button, cost);
    });
});

//admin
isAdmin(username);
