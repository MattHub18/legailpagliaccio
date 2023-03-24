const makeCards = (username, teamName, teamLogo, trophies) => {

    let palmares = "";
    for (let trophy of trophies) {
        let className;
        let type = trophy['type'];
        if (type === "gold" || type === "silver" || type === "bronze")
            className = "fa-medal";
        else if (type === "trophy")
            className = "fa-trophy";
        else
            className = "fa-ban";

        palmares +=
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
};

document.addEventListener('DOMContentLoaded', () => {
    firebase.database().ref("users").on("value", (snapshot) => {
        const users = snapshot.val();
        if(users){
            for (const [username, user] of Object.entries(users)) {
                const trophies = [];
                for (const [, value] of Object.entries(user['trophies']))
                    trophies.push(value);

                makeCards(username, user['teamName'], user['teamLogo'], trophies);
            }

            [].forEach.call(document.querySelectorAll('.flipper'), function (el) {
                el.addEventListener('click', function () {
                    el.classList.toggle('flip');
                });
            });
        }
    });
});