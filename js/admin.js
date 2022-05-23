const teamSelect=document.querySelector(".team-select");
const trophySelect=document.querySelector(".trophy-select");
const yearSelect=document.querySelector(".year-select");

firebase.database().ref("users").once('value',(snapshot)=>{
    for(const[username, user] of Object.entries(snapshot.val())){
        var option = document.createElement("option");
        option.text = username;
        option.value = username;
        teamSelect.appendChild(option);
    }
});

const currentYear = new Date().getFullYear();

for(var year = 2015; year < 2100; year++){
    var option = document.createElement("option");
    var y = `${year}-${(year+1)}`
    option.text = y;
    option.value = y;

    if(year === currentYear-1)
        option.setAttribute("selected", "selected");

    yearSelect.appendChild(option);
}

trophySelect.addEventListener('change',(event)=>{
    const id = event.target.value;
    trophySelect.setAttribute('id', id);
});

document.querySelector(".btn").addEventListener('click', ()=>{
    const team = teamSelect.value;
    const trophy = trophySelect.value;
    const year = yearSelect.value;

    firebase.database().ref("users/"+team+"/trophies").push().update({
        type: trophy,
        date: year
    });

    alert("trophy successfully added");

});
