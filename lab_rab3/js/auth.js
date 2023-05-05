"use strict";


document.addEventListener('DOMContentLoaded', main);

function main() {
    let authForm = document.getElementById('authForm');
    if(authForm === null) {
        console.log('authForm === null')
    }
    authForm.addEventListener('submit', authFormHandler);

}

// function authFormHandler(event) {
//     event.preventDefault();
//     const email = event.target.querySelector('#email').value;
//     const password = event.target.querySelector('#password').value;

//     console.log(email, password);
//     authWithEmailAndPassword(email, password)
//     .then(token=>);
// }

// may be export needed
function authWithEmailAndPassword(email, password) {
    const apiKey = 'AIzaSyBKN2nI7Hj3pg59TjJXGtjJLM81vhipaa8'
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        email: email, 
        password: password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => data.idToken)
}