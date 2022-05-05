firebase.initializeApp({
    apiKey: "AIzaSyCQ2I5f1TjBeoeVN3QXrdQcylKf16EGL4w",
    authDomain: "fantacalcio-site-comments.firebaseapp.com",
    databaseURL: "https://fantacalcio-site-comments-default-rtdb.firebaseio.com",
    projectId: "fantacalcio-site-comments",
    storageBucket: "fantacalcio-site-comments.appspot.com",
    messagingSenderId: "622078507962",
    appId: "1:622078507962:web:75a6119d85107521317b83"
});

document.querySelector(".btn").addEventListener('click',()=>{
    const comment = document.getElementsByClassName("comment")[0].value;
    if(comment != ""){
        const el = document.getElementsByClassName("bl carousel-item active")[0];
        if(el !=null)
            el.classList.toggle('active');
        firebase.database().ref('comments').update({ [new Date().getTime()]: comment });
        document.getElementsByClassName("comment")[0].value='';
    }
});

function appendChildren(comment){
    var tagComment = document.createElement("p");
    tagComment.appendChild(document.createTextNode(comment));

    var car_item = document.createElement("div");
    car_item.className = "bl carousel-item";
    car_item.appendChild(tagComment);

    document.getElementsByClassName("bl carousel-inner")[0].appendChild(car_item);
}

$(document).ready(()=>{
    firebase.database().ref('comments').on('value', (snapshot)=>{
        document.getElementsByClassName("bl carousel-inner")[0].innerHTML='';
        if(snapshot.val() != null){
            for (const [key, value] of Object.entries(snapshot.val())) {
                appendChildren(value);
            }
            document.getElementsByClassName("bl carousel-item")[0].classList.toggle('active');
        }
    })
});
