const makeCards = (username, teamName, teamLogo, trophies) => {

    let palmares ="";
    for (let trophy of trophies) {
        let className;
        let type = trophy['type'];
        switch(type){
            case "gold":
                className = "fa-medal";
                break;
            case  "silver":
                className = "fa-medal";
                break;
            case "bronze":
                className = "fa-medal";
                break;
            case "trophy":
                className = "fa-trophy";
                break;
            default:
                className = "fa-ban";
                break;
        }

        palmares+=
            `<div class="palmares col-xs-3">
                <i class="fas ${className}" id=${type}></i>
                <p>${trophy['date']}</p>
            </div>`;
    }

    document.getElementById("row").innerHTML +=
        `<div class="flipper col-xl-3 col-md-6 col-sm-12">
            <div class="team-card">
                <div class="front">
                    <img class="img-fluid team-logo" src=${teamLogo} alt="logo">
                    <h3 class="team-name">${teamName}</h3>
                </div>
                <div class="back">
                    <h3 class="username">${username}</h3>
                    <div class="container">
                        <div class="row" id="inner-row">
                            ${palmares}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    firebase.database().ref("users").on("value", (snapshot) => {
        const users = snapshot.val();
        if(users){
            for (const [username, user] of Object.entries(users)) {
            const teamName = user['teamName'];
            const teamLogo = user['teamLogo'];

            const trophies = [];
            for (const [, value] of Object.entries(user['trophies']))
                trophies.push(value);

            makeCards(username, teamName, teamLogo, trophies);
            }

            [].forEach.call(document.querySelectorAll('.flipper'), function (el) {
                el.addEventListener('click', function () {
                    el.classList.toggle('flip');
                });
            });
        }
    });

    document.getElementById('user').addEventListener('click', () => {
        document.getElementById('toggler').click();
        document.getElementById('login').classList.toggle('active');
    });

    document.getElementById('login-close').addEventListener('click', () => {
        document.getElementById('login').classList.remove('active');
    });

    document.getElementById('btn').addEventListener('click', () => {
        alert("todo log in db");
    });
});