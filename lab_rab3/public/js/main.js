import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, set, ref, update, onValue, get, child, remove } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, updateEmail, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

import firebaseConfig from './fbConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

let searchText = "Technology";
const isFavouritePage = document.querySelector("#is-favourite-page");

window.addEventListener('DOMContentLoaded', init);

function init() {
    if (isFavouritePage) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const dbRef = ref(getDatabase());
                get(child(dbRef, "users_books/")).then((snapshot) => {
                    if (snapshot.exists()) {
                        let data = snapshot.val();

                        for (var key in data) {
                            if (data[key].userId == auth.currentUser.uid) {
                                const bookInfoUrl = `https://gutendex.com/books/${data[key].bookId}`;
                                const bookInfoData = getBookInfoObj(bookInfoUrl);

                                bookInfoData.then(function (value) {
                                    displayBookInfo(value);
                                });
                            }
                        }
                    } else {
                        document.querySelector(".books__cards").innerHTML = "You have no books added in favorites.";
                    }
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                document.querySelector(".books__cards").innerHTML = "To view favorites you must authorize first.";
            }
        });
    } else {
        getBookInfo(searchText);
    }
}

async function getBookInfo(searchText) {
    const bookUrl = `https://gutendex.com/books/?search=${searchText}`;

    const response = await fetch(bookUrl);
    const data = await response.json();

    const booksArray = splitArrayIntoChunks(data.results);

    for (let j = 0; j < 5; j++) {
        const bookId = booksArray[0][j].id;

        const bookInfoUrl = `https://gutendex.com/books/${bookId}`;
        const bookInfoData = getBookInfoObj(bookInfoUrl);

        bookInfoData.then(function (value) {
            displayBookInfo(value);
        });
    }

    if (document.querySelector(".pages__item-last")) {
        document.querySelector(".pages__item-last").innerHTML = booksArray.length;
    }
    let bookCards = document.querySelector(".books__cards");

    if (document.querySelector(".buttons__col-right")) {
        document.querySelector(".buttons__col-right").addEventListener("click", () => {
            let selected = document.querySelector(".pages__item-selected").textContent;

            selected *= 1;
            if (selected <= ((document.querySelector(".pages__item-last").textContent * 1) - 1)) {
                selected++;
                bookCards.innerHTML = "";
                for (let j = 0; j < 5; j++) {
                    const bookId = booksArray[selected - 1][j].id;

                    const bookInfoUrl = `https://gutendex.com/books/${bookId}`;
                    const bookInfoData = getBookInfoObj(bookInfoUrl);

                    bookInfoData.then(function (value) {
                        displayBookInfo(value);
                    });
                }
            }

            document.querySelector(".pages__item-selected").textContent = selected;
        })
    }

    if (document.querySelector(".buttons__col-left")) {
        document.querySelector(".buttons__col-left").addEventListener("click", () => {
            let selected = document.querySelector(".pages__item-selected").textContent;

            selected *= 1;
            if (selected > 1) {
                selected--;
                bookCards.innerHTML = "";
                for (let j = 0; j < 5; j++) {
                    const bookId = booksArray[selected - 1][j].id;

                    const bookInfoUrl = `https://gutendex.com/books/${bookId}`;
                    const bookInfoData = getBookInfoObj(bookInfoUrl);

                    bookInfoData.then(function (value) {
                        displayBookInfo(value);
                    });
                }
            }

            document.querySelector(".pages__item-selected").textContent = selected;
        })
    }
}

async function getBookInfoObj(bookInfoUrl) {
    const bookInfoResponse = await fetch(bookInfoUrl);
    const bookInfoData = await bookInfoResponse.json();

    return bookInfoData;
}

function displayBookInfo(bookInfo) {
    const hidden = document.createElement('input');
    hidden.setAttribute("type", "hidden");
    hidden.setAttribute("id", "book-id");
    hidden.setAttribute("value", bookInfo.id);

    const section = document.createElement('section');
    section.classList.add('books__card', 'card');
    section.appendChild(hidden);

    const div1 = document.createElement('div');
    div1.classList.add('card__row');

    const div2 = document.createElement('div');
    div2.classList.add('card__col');

    const div3 = document.createElement('div');
    div3.classList.add('card__image');

    const img = document.createElement('img');
    img.src = bookInfo.formats["image/jpeg"];
    img.alt = 'Book preview';

    div3.appendChild(img);
    div2.appendChild(div3);

    const div4 = document.createElement('div');
    div4.classList.add('card__col');

    const textWrap = document.createElement('div');
    textWrap.classList.add('text-wrap');

    const title = document.createElement('div');
    title.classList.add('card__title');
    title.textContent = bookInfo.title;

    const author = document.createElement('div');
    author.classList.add('card__author');
    author.innerHTML = bookInfo.authors[0].name;

    const article = document.createElement('article');
    article.classList.add('card__description');


    bookInfo.subjects.forEach(element => {
        let author = document.createElement("div");
        author.textContent = element;

        article.append(author);
    });

    textWrap.appendChild(title);
    textWrap.appendChild(author);
    textWrap.appendChild(article);
    div4.appendChild(textWrap);

    const buttonsWrap = document.createElement('div');
    buttonsWrap.classList.add('buttons-wrap');

    const button1 = document.createElement('button');
    button1.classList.add('card__favourite-' + bookInfo.id);
    button1.classList.add('card__favourite');

    const img2 = document.createElement('img');
    img2.src = 'images/star-tr-icon.svg';
    img2.alt = 'Like';

    const dbRef = ref(getDatabase());
    if (auth.currentUser) {
        get(child(dbRef, "users_books/" + auth.currentUser.uid + "_" + bookInfo.id)).then((snapshot) => {
            if (snapshot.exists()) {
                img2.src = 'images/star-filled-icon.svg';
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    button1.appendChild(img2);

    button1.addEventListener("click", () => {
        addToFavorite(hidden.value);
    });

    const button2 = document.createElement('button');
    button2.classList.add('card__read');
    button2.textContent = 'Read';

    button2.addEventListener("click", () => {
        displayBookText(hidden.value);
    });

    buttonsWrap.appendChild(button1);
    buttonsWrap.appendChild(button2);
    div4.appendChild(buttonsWrap);

    div1.appendChild(div2);
    div1.appendChild(div4);

    section.appendChild(div1);

    if (document.querySelector(".books__cards")) {
        document.querySelector(".books__cards").append(section);
    }
}

async function displayBookText(bookId) {
    const bookUrl = `https://cors-anywhere.herokuapp.com/https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`;

    const response = await fetch(bookUrl);
    const text = await response.text();
    let pages = splitText(text);

    document.querySelector(".books__cards").innerHTML = "";
    if (document.querySelector(".books__buttons")) {
        document.querySelector(".books__buttons").innerHTML = "";
    }
    document.querySelector(".books__cards").append(drawDetailBookPage());
    const bookText = document.querySelector(".book-text__text");
    document.querySelector(".pages__item-last").innerHTML = pages.length;
    const dbRef = ref(getDatabase());

    onAuthStateChanged(auth, (user) => {
        if (user) {
            get(child(dbRef, "users_books/" + user.uid + "_" + bookId)).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    bookText.innerHTML = pages[data.page - 1];
                    highlightTextHandler(".book-text__text", data.page, bookId);
                    document.querySelector(".pages__item-selected").textContent = data.page;
                    document.querySelectorAll(".pages__item")[1].textContent = data.page + 1;

                    get(child(dbRef, "users_marks/")).then((snapshot) => {
                        if (snapshot.exists()) {
                            let dataMarks = snapshot.val();

                            for (var item in dataMarks) {
                                if (dataMarks[item].userId == auth.currentUser.uid && dataMarks[item].bookId == bookId && dataMarks[item].page == data.page) {
                                    highlightTextByPosition(".book-text__text", dataMarks[item].selectionStart, dataMarks[item].selectionLength);
                                }
                            }
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {
            bookText.innerHTML = pages[0];
        }
    });

    function highlightTextByPosition(selector, start, length) {
        const element = document.querySelector(selector);

        if (element) {
            const range = document.createRange();
            const textNode = element.lastChild;

            range.setStart(textNode, start);
            range.setEnd(textNode, start + length);
            const span = document.createElement('span');
            span.classList.add("mark-yellow");
            range.surroundContents(span);
        }
    }

    if (document.querySelector(".buttons__col-right")) {
        document.querySelector(".buttons__col-right").addEventListener("click", () => {
            let selected = document.querySelector(".pages__item-selected").textContent;
            let btn2 = document.querySelectorAll(".pages__item")[1].textContent;

            selected *= 1;
            if (selected <= ((document.querySelector(".pages__item-last").textContent * 1) - 3)) {
                selected++;
                document.querySelectorAll(".pages__item")[1].textContent = (btn2 * 1) + 1;
                bookText.innerHTML = pages[selected - 1];
            }

            document.querySelector(".pages__item-selected").textContent = selected;

            const dbRef = ref(getDatabase());

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    get(child(dbRef, "users_books/" + auth.currentUser.uid + "_" + bookId)).then((snapshot) => {
                        if (snapshot.exists()) {
                            update(ref(database, "users_books/" + auth.currentUser.uid + "_" + bookId), {
                                page: selected
                            });
                        } else {
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            });
        })
    }

    if (document.querySelector(".buttons__col-left")) {
        document.querySelector(".buttons__col-left").addEventListener("click", () => {
            let selected = document.querySelector(".pages__item-selected").textContent;
            let btn2 = document.querySelectorAll(".pages__item")[1].textContent;

            selected *= 1;
            if (selected > 1) {
                selected--;
                document.querySelectorAll(".pages__item")[1].textContent = (btn2 * 1) - 1;
                bookText.innerHTML = pages[selected - 1];
            }

            document.querySelector(".pages__item-selected").textContent = selected;

            const dbRef = ref(getDatabase());


            onAuthStateChanged(auth, (user) => {
                if (user) {
                    get(child(dbRef, "users_books/" + auth.currentUser.uid + "_" + bookId)).then((snapshot) => {
                        if (snapshot.exists()) {
                            update(ref(database, "users_books/" + auth.currentUser.uid + "_" + bookId), {
                                page: selected
                            });
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            });
        })
    }
}

function splitText(text) {
    const maxLength = 20000;
    const chunks = [];

    for (let i = 0; i < text.length; i += maxLength) {
        chunks.push(text.slice(i, i + maxLength));
    }

    return chunks;
}

function drawDetailBookPage() {
    const section = document.createElement("section");
    section.className = "book-text";

    const textDiv = document.createElement("div");
    textDiv.className = "book-text__text";
    textDiv.textContent = "";
    section.appendChild(textDiv);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "book-text__buttons buttons";

    const buttonsRow = document.createElement("div");
    buttonsRow.className = "buttons__row";

    const buttonsCol1 = document.createElement("div");
    buttonsCol1.className = "buttons__col";

    const col1LeftBtn = document.createElement("div");
    col1LeftBtn.className = "buttons__col-left main-btn";
    col1LeftBtn.textContent = "<";
    buttonsCol1.appendChild(col1LeftBtn);

    const buttonsCol2 = document.createElement("div");
    buttonsCol2.className = "buttons__col";

    const col2PagesDiv = document.createElement("div");
    col2PagesDiv.className = "buttons__col-pages pages";

    const col2Page1 = document.createElement("div");
    col2Page1.className = "pages__item pages__item-selected main-btn";
    col2Page1.textContent = "1";
    col2PagesDiv.appendChild(col2Page1);

    const col2Page2 = document.createElement("div");
    col2Page2.className = "pages__item main-btn";
    col2Page2.textContent = "2";
    col2PagesDiv.appendChild(col2Page2);

    const col2Page3 = document.createElement("div");
    col2Page3.className = "pages__item main-btn";
    col2Page3.style.background = "transparent !important";
    col2Page3.textContent = "...";
    col2PagesDiv.appendChild(col2Page3);

    const col2PageLast = document.createElement("div");
    col2PageLast.className = "pages__item pages__item-last main-btn";
    col2PageLast.textContent = "32";
    col2PagesDiv.appendChild(col2PageLast);

    buttonsCol2.appendChild(col2PagesDiv);

    const buttonsCol3 = document.createElement("div");
    buttonsCol3.className = "buttons__col";

    const col3RightBtn = document.createElement("div");
    col3RightBtn.className = "buttons__col-right main-btn";
    col3RightBtn.textContent = ">";
    buttonsCol3.appendChild(col3RightBtn);

    buttonsRow.appendChild(buttonsCol1);
    buttonsRow.appendChild(buttonsCol2);
    buttonsRow.appendChild(buttonsCol3);

    buttonsDiv.appendChild(buttonsRow);

    section.appendChild(buttonsDiv);

    return section;
}

function addToFavorite(bookId) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const user = auth.currentUser;
            const dbRef = ref(getDatabase());

            get(child(dbRef, "users_books/" + user.uid + "_" + bookId)).then((snapshot) => {
                if (!snapshot.exists()) {
                    update(ref(database, "users_books/" + user.uid + "_" + bookId), {
                        userId: user.uid,
                        bookId: bookId,
                        page: 1
                    });

                    document.querySelector(".card__favourite-" + bookId + " img").src = "images/star-filled-icon.svg";
                } else {
                    remove(ref(database, "users_books/" + user.uid + "_" + bookId));

                    document.querySelector(".card__favourite-" + bookId + " img").src = "images/star-tr-icon.svg";
                }
            }).catch((error) => {
                console.error(error);
            });
        }
        else {
            alert("You cannot add to favorites until you are logged in.");
        }
    });
}

if (document.querySelector("#search-form")) {
    document.querySelector("#search-form").addEventListener("submit", (e) => {
        e.preventDefault();
        searchText = document.querySelector("#search-keyword").value;
        document.querySelector(".books__cards").innerHTML = "";

        getBookInfo(searchText);
    })
}

function highlightTextHandler(selector, page, bookId) {
    var selectionStart = null;
    var selectionEnd = null;
    var selectionLength = 0;

    function highlightText() {
        const selectedText = window.getSelection().toString();
        if (selectedText.length > 0) {
            const range = window.getSelection().getRangeAt(0);
            const startContainer = range.startContainer;
            const startOffset = range.startOffset;
            const endContainer = range.endContainer;
            const endOffset = range.endOffset;
            selectionStart = { container: startContainer, offset: startOffset };
            console.log(selectionStart);
            selectionEnd = { container: endContainer, offset: endOffset };
            selectionLength = selectedText.length;
            range.deleteContents();
            const span = document.createElement('span');
            span.style.backgroundColor = '#BEB24C';
            span.appendChild(document.createTextNode(selectedText));
            range.insertNode(span);
        }

        onAuthStateChanged(auth, (user) => {
            if (user) {
                const user = auth.currentUser;
                const dbRef = ref(getDatabase());

                get(child(dbRef, "users_marks/" + user.uid + "_" + bookId + "_" + page + "_" + selectionStart.offset)).then((snapshot) => {
                    if (!snapshot.exists()) {
                        update(ref(database, "users_marks/" + user.uid + "_" + bookId + "_" + page + "_" + selectionStart.offset), {
                            userId: user.uid,
                            bookId: bookId,
                            page: page,
                            selectionStart: selectionStart.offset,
                            selectionLength: selectionLength
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        });
    }

    document.querySelector(selector).addEventListener('mouseup', highlightText);
}

function splitArrayIntoChunks(array) {
    const chunkSize = 5;
    const chunks = [];

    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        chunks.push(chunk);
    }

    return chunks;
}