document.addEventListener('DOMContentLoaded', function () {
    const inputBookForm = document.getElementById('inputBook');
    const searchBookForm = document.getElementById('searchBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    inputBookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addBook();
    });

    searchBookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
        searchBooks(searchTitle);
    });

    loadBooks();
});

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = Number(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    const id = new Date().getTime(); // Timestamp sebagai id unik

    const bookItem = createBook(title, author, year, isComplete, id);

    if (isComplete) {
        completeBookshelfList.appendChild(bookItem);
    } else {
        incompleteBookshelfList.appendChild(bookItem);
    }

    // Save books to localStorage after adding the book
    saveBooks();

    // Clear the input fields after adding the book
    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
}

function toggleBookStatus(bookItem) {
    const isComplete = bookItem.parentElement.isEqualNode(completeBookshelfList);
    const toggleButton = bookItem.querySelector('.action button');

    if (isComplete) {
        incompleteBookshelfList.appendChild(bookItem);
        toggleButton.innerText = 'Belum selesai di Baca';
        toggleButton.classList.remove('green');
        toggleButton.classList.add('red');
    } else {
        completeBookshelfList.appendChild(bookItem);
        toggleButton.innerText = 'Selesai dibaca';
        toggleButton.classList.remove('red');
        toggleButton.classList.add('green');
    }

    // Save books to localStorage after moving the book
    saveBooks();
}

function deleteBook(bookItem) {
    const isComplete = bookItem.parentElement.isEqualNode(completeBookshelfList);
    const bookshelf = isComplete ? completeBookshelfList : incompleteBookshelfList;

    bookshelf.removeChild(bookItem);

    // Save books to localStorage after deleting the book
    saveBooks();
}

function createBook(title, author, year, isComplete, id) {
    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');

    const titleElement = document.createElement('h3');
    titleElement.innerText = title;

    const authorElement = document.createElement('p');
    authorElement.innerText = `Penulis: ${author}`;

    const yearElement = document.createElement('p');
    yearElement.innerText = `Tahun: ${year}`;

    const idElement = document.createElement('p');
    idElement.innerText = `ID: ${id}`;

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    const toggleButton = document.createElement('button');
    toggleButton.innerText = isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
    toggleButton.classList.add(isComplete ? 'green' : 'red');
    toggleButton.addEventListener('click', function () {
        toggleBookStatus(bookItem);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.classList.add('red');
    deleteButton.addEventListener('click', function () {
        deleteBook(bookItem);
    });

    actionContainer.appendChild(toggleButton);
    actionContainer.appendChild(deleteButton);

    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorElement);
    bookItem.appendChild(yearElement);
    bookItem.appendChild(idElement);
    bookItem.appendChild(actionContainer);

    return bookItem;
}

function saveBooks() {
    const incompleteBooks = [...incompleteBookshelfList.children].map(book => getBookData(book));
    const completeBooks = [...completeBookshelfList.children].map(book => getBookData(book));

    const allBooks = {
        incomplete: incompleteBooks,
        complete: completeBooks
    };

    localStorage.setItem('books', JSON.stringify(allBooks));
}

function loadBooks() {
    const storedBooks = localStorage.getItem('books');

    if (storedBooks) {
        const allBooks = JSON.parse(storedBooks);

        if (allBooks.incomplete) {
            allBooks.incomplete.forEach(bookData => {
                const bookItem = createBook(bookData.title, bookData.author, bookData.year, bookData.isComplete, bookData.id);
                incompleteBookshelfList.appendChild(bookItem);
            });
        }

        if (allBooks.complete) {
            allBooks.complete.forEach(bookData => {
                const bookItem = createBook(bookData.title, bookData.author, bookData.year, bookData.isComplete, bookData.id);
                completeBookshelfList.appendChild(bookItem);
            });
        }
    }
}

function getBookData(bookItem) {
    const title = bookItem.querySelector('h3').innerText;
    const author = bookItem.querySelector('p:nth-child(2)').innerText.replace('Penulis: ', '');
    const year = parseInt(bookItem.querySelector('p:nth-child(3)').innerText.replace('Tahun: ', ''));
    const id = bookItem.querySelector('p:nth-child(4)').innerText.replace('ID: ', '');
    const isComplete = bookItem.parentElement.isEqualNode(completeBookshelfList);

    return {
        title,
        author,
        year,
        id,
        isComplete
    };
}

function searchBooks(searchTitle) {
    const allBooks = [...incompleteBookshelfList.children, ...completeBookshelfList.children];
    allBooks.forEach(bookItem => {
        const title = bookItem.querySelector('h3').innerText.toLowerCase();
        const isMatch = title.includes(searchTitle);
        bookItem.style.display = isMatch ? 'block' : 'none';
    });
}
