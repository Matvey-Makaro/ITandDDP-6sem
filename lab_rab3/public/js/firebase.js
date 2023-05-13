import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, set, ref, update, get, child } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

import firebaseConfig from './fbConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

if (document.querySelector("#register-form")) {
    document.querySelector("#register-form").addEventListener("submit", (e) => {
        e.preventDefault();

        let email = document.querySelector("#register-email").value;
        let password = document.querySelector("#register-password").value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: "user name",
                }).then(() => {
                    alert("user created");
                });

                set(ref(database, "users/" + user.uid), {
                    email: email,
                    displayName: "user name",
                    user_metadata: {
                        birthday: "2023-01-01",
                        avatar: "images/user-avatar.png"
                    }
                })

                window.location.href = 'index.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    })
}

if (document.querySelector("#login-form")) {
    document.querySelector("#login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        let email = document.querySelector("#login-email").value;
        let password = document.querySelector("#login-password").value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const date = new Date();
                update(ref(database, "users/" + user.uid), {
                    last_login: date
                })
                window.location.href = 'index.html';
                alert("signed in");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    })
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                let data = snapshot.val();
                const wrap = document.querySelector(".autho-wrap");
                wrap.innerHTML = "";
                wrap.append(createAuthoPanel(data.displayName, data.photoURL));

                document.querySelector("#logout-btn").addEventListener("click", (e) => {
                    signOut(auth).then(() => {
                        alert("signed out");
                        window.location.replace("index.html");
                    }).catch((error) => {
                        alert(error);
                    });
                })
            }
        }).catch((error) => {
            console.error(error);
        });
    }
});

function createAuthoPanel(username, photoURL) {
    const nav = document.createElement('nav');
    nav.setAttribute('class', 'header__authorized authorized');

    const link1 = document.createElement('a');
    link1.setAttribute('href', 'profile.html');
    link1.setAttribute('class', 'authorized__item');

    const image = document.createElement('img');
    image.setAttribute('class', 'authorized__image');
    let url = photoURL ? photoURL : 'images/user-avatar.png';
    image.setAttribute('src', url);
    image.setAttribute('alt', 'User');

    const span = document.createElement('span');
    span.textContent = username;

    link1.appendChild(image);
    link1.appendChild(span);

    const link2 = document.createElement('button');
    link2.setAttribute('class', 'main-btn authorized__item');
    link2.setAttribute('id', 'logout-btn');
    link2.textContent = 'Log out';

    nav.appendChild(link1);
    nav.appendChild(link2);

    return nav;
}