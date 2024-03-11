function getCookie() {
    let name = "admin=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if (getCookie() === "")
    location.replace("index.html");

document.addEventListener("DOMContentLoaded", () => {

    const toggler = document.getElementById('toggler');
    toggler.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
        const icon = toggler.children[0];
        let add;
        let remove;
        if (icon.classList.contains('fa-arrow-right')) {
            add = 'fa-arrow-left';
            remove = 'fa-arrow-right';
        } else {
            add = 'fa-arrow-right';
            remove = 'fa-arrow-left';
        }
        icon.classList.add(add);
        icon.classList.remove(remove);
    });

    if (window.innerWidth >= 768)
        toggler.click()

    let indexLastActive = -1;

    firebase.database().ref('users').on('value', (snapshot) => {
        const users = snapshot.val();
        if (users) {
            let sidenav = document.getElementById('sidenav');
            sidenav.innerHTML =
                `<li class="nav-item new-team">
                    <a id="add-team-btn" class="nav-link add-team" href="#"><i class="fas fa-plus icon"></i>New Team</a>
                </li>`;
            const usersList = Object.keys(users);
            for (const user of Object.values(users)) {
                sidenav.innerHTML +=
                    `<li class="nav-item">
                               <a class="nav-link users" href="#"><img class="icon" src="${user['teamLogo']}" alt="icon"/>${user['teamName']}</a>
                           </li>`;
            }

            [].forEach.call(document.querySelectorAll('.users'), (user, index) => {

                user.addEventListener('click', (e) => {
                    e.preventDefault();
                    [].forEach.call(document.querySelectorAll('.users'), (user) => {
                        user.classList.remove('active')
                    });
                    user.classList.toggle('active');
                    indexLastActive = index;
                    document.getElementById('user-icon').src = user.children[0].src;
                    document.getElementById('username').value = usersList[index];
                    document.getElementById('teamName').value = user.innerText;

                    const trophies = document.getElementById('trophies').children[0];
                    const hasTrophies = users[usersList[index]]['trophies'];
                    trophies.innerHTML = "";
                    if (hasTrophies)
                        trophies.innerHTML = getPalmares(Object.entries(hasTrophies), `<div class="trophy">`, `<i class="fas fa-minus del-t"></i>`);

                    trophies.innerHTML +=
                        `<div id="trophy-add" class="trophy" data-toggle="modal" data-target="#modal">
                               <i class="fas fa-plus trophy-icon"></i>
                               <p>Add trophy</p>
                        </div>`;

                    [].forEach.call(document.querySelectorAll('.del-t'), (del) => {
                        del.addEventListener('click', (e) => {
                            e.preventDefault();
                            const trophy = del.parentNode;
                            firebase.database().ref(`users/${usersList[index]}/trophies/${trophy.id}`).remove();
                        })
                    });
                });
                if (indexLastActive=== -1){
                    if(index === 0)
                        user.click();
                }
                else
                    document.querySelectorAll('.users')[indexLastActive].click();

            });

            document.getElementById('add-team-btn').addEventListener('click', (e) => {
                e.preventDefault()
                firebase.database().ref('users/newUser').set({teamLogo: "img/blank-logo.png", teamName: "New Team"});
            });

            document.getElementById('sve').addEventListener('click', (e) => {
                e.preventDefault()
                const teamname = document.querySelector('.users.active').text;
                let username = "";
                for (const user of usersList) {
                    if (users[user]['teamName'] === teamname) {
                        username = user;
                        break;
                    }
                }

                const uName = document.getElementById('username').value;
                let objUser = {
                    teamLogo: document.getElementById('user-icon').src,
                    teamName: document.getElementById('teamName').value,
                };
                const t = users[username]['trophies'];
                if (t)
                    objUser = Object.assign(objUser, {trophies: t});

                firebase.database().ref(`users/${username}`).remove();
                firebase.database().ref(`users/${uName}`).set(objUser);
            });
        }
    });

    document.getElementById('del').addEventListener('click', (e) => {
        e.preventDefault()
        firebase.database().ref(`users/${document.getElementById('username').value}`).remove();
    });


    document.getElementById('upload').addEventListener("change", (e) => {
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref(`img/teams/${file.name}`);
        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then((downloadURL) => {
                document.getElementById('user-icon').src = downloadURL;
            });
        });
    });

    const dropdown = document.getElementById('dropdown-menu');
    const date = new Date().getFullYear() - 1;
    for (let i = -5; i < 5; i++) {
        dropdown.innerHTML += `<option class="dropdown-item" value="${date + i}-${date +1 + i}">${date + i}-${date +1 + i}</option>`;
    }

    document.getElementById('add-trophy').addEventListener('click', (e) => {
        e.preventDefault();
        const trophy = document.querySelector('input[name="trophy"]:checked').value.toLowerCase();
        const year = label.innerText;
        const username = document.getElementById('username').value;
        firebase.database().ref(`users/${username}/trophies`).push({type:trophy, date:year});

        [].forEach.call(document.querySelectorAll('input[name="trophy"]'), (btn) => {
            btn.checked = false;
        });
    });
});


