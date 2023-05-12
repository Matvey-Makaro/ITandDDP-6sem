import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, set, ref, update, onValue, get, child } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, updateEmail, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

import firebaseConfig from './fbConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateform(user);
    }
});

if (document.querySelector("#edit-user-form")) {
    document.querySelector("#edit-user-form").addEventListener("submit", (e) => {
        const email = document.querySelector("#edit-email").value;
        const username = document.querySelector("#edit-username").value;
        const birthday = document.querySelector("#edit-birthday").value;
        const avatar = document.querySelector("#edit-avatar").value;

        const user = auth.currentUser;
        update(ref(database, "users/" + user.uid), {
            displayName: username,
            photoURL: avatar,
            email: email,
            user_metadata: {
                avatar: avatar,
                birthday: birthday
            }
        });
        updateProfile(auth.currentUser, {
            displayName: username,
            photoURL: avatar,
        }).then(() => {
            alert("profile updated");
            updateform(user);
        }).catch((error) => {
            alert(error);
        });

        updateEmail(auth.currentUser, email).then(() => {
            alert("email updated");
        }).catch((error) => {
            alert(error);
        });
    })
}

function updateform(user) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();

            document.querySelector("#edit-email").value = data.email;
            document.querySelector("#edit-username").value = data.displayName;
            document.querySelector("#edit-birthday").value = data.user_metadata.birthday;
            document.querySelector("#edit-avatar").value = data.user_metadata.avatar;
            document.querySelector("#edit-avatar").src = data.user_metadata.avatar;
        }
    }).catch((error) => {
        console.error(error);
    });
}