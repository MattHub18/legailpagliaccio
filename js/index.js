const makeCards = (username, teamName, teamLogo, trophies) => {

    let palmares = getPalmares(trophies, `<div class="palmares col-xs-3">`, "");

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
            document.getElementById("row").innerHTML = "";
            for (const [username, user] of Object.entries(users)) {
                const trophies = [];
                const hasTrophies = user['trophies'];
                if(hasTrophies) {
                    for (const value of Object.entries(hasTrophies))
                        trophies.push(value);
                }

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