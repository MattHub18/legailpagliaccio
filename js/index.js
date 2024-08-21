function makeCards(username, teamName, teamLogo, trophies) {

    let showcase = "";
    for (let trophy of trophies) {
        let date = trophy.date;
        let type = trophy.type;
        let className;
        if (type === "trophy")
            className = "fa-trophy";
        else
            className = "fa-medal";

        showcase += `<div class="palmares col-xs-3">
            <i class="fas ${className}"></i>
            <p>${date}</p>
            </div>`;
    }

    if (teamLogo === "")
        teamLogo = "default";

    teamLogo = "img/teams/" + teamLogo + ".png";

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
                            ${showcase}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("row").innerHTML = "";
    for (let user of users) {
        let username = user.username;
        let teamName = user.teamName;
        let teamLogo = user.teamLogo;
        let trophies = user.trophies;
        makeCards(username, teamName, teamLogo, trophies);
    }

    [].forEach.call(document.querySelectorAll('.flipper'), function (el) {
        el.addEventListener('click', function () {
            el.classList.toggle('flip');
        });
    });
});
