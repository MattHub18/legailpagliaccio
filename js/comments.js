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
    });
});
