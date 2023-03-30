MAKARO MATVEY, 053502
Library

Project description:
The project will be an online library where you can read books and take notes.

Main functions:
1. Authorisation
2. Registration
3. Read book
4. Add/remove track to/from favorites.
5. Add/remove notes. 
6. Search books by title and author.
7. Edit profile (avatar and personal data)
8. Memorizing the page the user was reading.

Data models:

User: Id, Name, Password, Birthday, Аvatar, Favorites books.
Book: Id, Name, Author, text.
Author: Id, Name, Surname, Patronymic, Pseudonym, Publication year
Process reading: Book, User, current_page, notes
Note: book, page, text.
