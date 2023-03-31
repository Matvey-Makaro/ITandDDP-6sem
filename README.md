# Makaro Matvey, 053502

# Library

# Project description:
The project will be an online library where you can read books and take notes.

# Mock up
Main page
![](https://github.com/Matvey-Makaro/ITandDDP-6sem/blob/lab_rab2/lab_rab2/main_page.png)

Read page
![](https://github.com/Matvey-Makaro/ITandDDP-6sem/blob/lab_rab2/lab_rab2/read_page.png)

Profile page
![](https://github.com/Matvey-Makaro/ITandDDP-6sem/blob/lab_rab2/lab_rab2/profile_page.png)

Settings page
![](https://github.com/Matvey-Makaro/ITandDDP-6sem/blob/lab_rab2/lab_rab2/settings_page.png)

Log In page
![](https://github.com/Matvey-Makaro/ITandDDP-6sem/blob/lab_rab2/lab_rab2/log_in_page.png)

Sign Up page
![](https://github.com/Matvey-Makaro/ITandDDP-6sem/blob/lab_rab2/lab_rab2/sign_up_page.png)

# Main functions:
1. Authorisation
2. Registration
3. Read book
4. Add/remove book to/from favorites.
5. Add/remove notes. 
6. Search books by title and author.
7. Edit profile (avatar and personal data)
8. Memorizing the page the user was reading.

# Data models description

User: 
    id, 
    name,
    email,
    password, 
    birthday, 
    avatar, 
    favorites books

Book: 
    id, 
    name, 
    author, 
    text

Author: 
    id, 
    name, 
    surname, 
    patronymic, 
    pseudonym, 
    publication year

Process reading: 
    book, 
    user, 
    current_page, 
    notes

Note: 
    book, 
    page, 
    text.
