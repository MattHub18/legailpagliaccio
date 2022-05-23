firebase.initializeApp({
    apiKey: "AIzaSyCQ2I5f1TjBeoeVN3QXrdQcylKf16EGL4w",
    authDomain: "fantacalcio-site-comments.firebaseapp.com",
    databaseURL: "https://fantacalcio-site-comments-default-rtdb.firebaseio.com",
    projectId: "fantacalcio-site-comments",
    storageBucket: "fantacalcio-site-comments.appspot.com",
    messagingSenderId: "622078507962",
    appId: "1:622078507962:web:75a6119d85107521317b83"
});

function resetInput(input, placeholder){
    input.addEventListener('focus', ()=> {
        input.placeholder = placeholder;
        input.style = 'background-color: #ddd;';
    });
}

function isEmpty(field, input, placeholder){
    if(field ==""){
        input.placeholder = 'empty '+ placeholder;
        input.style = 'background-color: rgba(255,0,0,0.5);';
        return true;
    }
    return false;
}

function encrypt(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
    }
    return window.btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}

function decrypt(encoded) {
    const binary = window.atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

function setCookie(username) {
    document.cookie = "username="+username;
}

function getCookie(key) {
    let name = key + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function appendTrophies(award, selector){
    var nodeIcon = document.createElement("i");
    let cn;
    var type = award['type'];
    switch(type){
        case "gold":
            cn = "fas fa-medal";
            break;
        case  "silver":
            cn = "fas fa-medal";
            break;
        case "bronze":
            cn = "fas fa-medal";
            break;
        case "trophy":
            cn = "fas fa-trophy";
            break;
        default:
            cn = "fas fa-ban";
            break;
    }
    nodeIcon.className = cn;
    nodeIcon.setAttribute('id', type);

    var nodeDate = document.createElement("p");
    var date = award['date'];
    nodeDate.appendChild(document.createTextNode(date));

    var car_item = document.createElement("div");
    car_item.className = "carousel-item";
    car_item.appendChild(nodeIcon);
    car_item.appendChild(nodeDate);

    selector.appendChild(car_item);
}

async function isAdmin(username){
    const admin = document.querySelector(".adminAction");

    const userRef = await firebase.database().ref("users/"+username).once('value');
    const user = userRef.val();

    if(user!=null && user['admin'] && !admin.classList.contains('active'))
        admin.classList.toggle('active');

}
