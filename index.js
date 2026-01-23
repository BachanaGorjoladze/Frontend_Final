const booksData = [
    { title: 'The Hunger Games', price: '$12.99', color: '#ff5555' },
    { title: 'Fifty Shades', price: '$10.50', color: '#5555ff' },
    { title: 'JR Ward', price: '$15.00', color: '#ffaa00' },
    { title: 'Guilty Wives', price: '$9.99', color: '#55ff55' },
    { title: 'The Big Miss', price: '$18.00', color: '#aa00aa' }
];

const newBooksData = [
    { title: 'Drift', price: '$14.99', color: '#00aaaa' },
    { title: 'Before You Die', price: '$11.20', color: '#aaaa00' },
    { title: 'The Lorax', price: '$8.50', color: '#ff55aa' },
    { title: 'Harlan Coben', price: '$13.40', color: '#55aaff' },
    { title: 'Solid Contact', price: '$16.99', color: '#00ff00' }
];


function createShelf(containerId, books) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const shelfDiv = document.createElement('div');
    shelfDiv.className = 'shelf';

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';

        bookDiv.innerHTML = `
            <div class="book-cover" style="background: linear-gradient(45deg, #222, ${book.color}aa);">
                <span style="padding: 10px; text-align: center; font-size: 0.8rem; color: #fff; text-shadow: 1px 1px 2px #000;">
                    ${book.title}
                </span>
            </div>
            <div class="book-tag">${book.price}</div>
        `;

        shelfDiv.appendChild(bookDiv);
    });

    container.appendChild(shelfDiv);
}

document.addEventListener('DOMContentLoaded', () => {
    createShelf('shelf-1', booksData);
    createShelf('shelf-2', newBooksData);

    const userBubble = document.getElementById("userBubble");
    const username = localStorage.getItem("username");

    if (username && userBubble) {
        userBubble.textContent = username.charAt(0).toUpperCase() + username.slice(1);
    }
});
