async function fetchBooks() {
    try {
        const response = await fetch('https://gutendex.com/books');
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Failed to fetch books:', error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const cart = [];
    const cartBtn = document.getElementById('cartBtn');
    const cartDropdown = document.getElementById('cartDropdown');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartShippingEl = document.getElementById('cartShipping');
    const cartTotalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const notificationArea = document.getElementById('notificationArea');

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach((item, index) => {
            subtotal += item.price;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            const displayTitle = item.title.length > 18 ? item.title.substring(0, 18) + '...' : item.title;

            const coverHtml = item.coverUrl
                ? `<img src="${item.coverUrl}" alt="${item.title}" class="cart-item-cover">`
                : '<div class="cart-item-cover cart-item-placeholder">📖</div>';

            itemDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                    <button class="remove-item-btn" data-index="${index}" style="background: none; border: none; cursor: pointer; color: #ff5555; font-weight: bold;">✕</button>
                    ${coverHtml}
                    <span style="flex: 1;">${displayTitle}</span>
                </div>
                <span>$${item.price.toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        const removeBtns = cartItemsContainer.querySelectorAll('.remove-item-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartUI();
            });
        });

        const shipping = subtotal > 50 || subtotal === 0 ? 0 : subtotal * 0.10;
        const total = subtotal + shipping;

        cartSubtotalEl.textContent = '$' + subtotal.toFixed(2);
        cartShippingEl.textContent = '$' + shipping.toFixed(2);
        cartTotalEl.textContent = '$' + total.toFixed(2);
        cartCount.textContent = `(${cart.length})`;
    }

    function addToCart(book) {
        let priceVals = parseFloat(book.price.replace('$', ''));
        if (isNaN(priceVals)) priceVals = 0;

        cart.push({
            title: book.title,
            price: priceVals,
            coverUrl: book.coverUrl || null
        });
        updateCartUI();

        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }

    cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cartDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
            cartDropdown.classList.remove('show');
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            const notif = document.createElement('div');
            notif.className = 'notification';
            notif.innerHTML = `
                <h3>Cart is Empty</h3>
                <p>Please add some books to your cart before checking out.</p>
                <button onclick="this.parentElement.remove()" style="margin-top:10px; padding:5px 10px; cursor:pointer;">Close</button>
            `;
            notificationArea.appendChild(notif);

            setTimeout(() => {
                if (notif.parentElement) notif.remove();
            }, 3000);
            return;
        }

        let subtotal = 0;
        cart.forEach(item => subtotal += item.price);
        const shipping = subtotal > 50 ? 0 : subtotal * 0.10;
        const total = subtotal + shipping;

        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.innerHTML = `
            <h3>Order Placed!</h3>
            <p>You bought ${cart.length} books.</p>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Shipping: $${shipping.toFixed(2)}</p>
            <p><strong>Total: $${total.toFixed(2)}</strong></p>
            <button onclick="this.parentElement.remove()" style="margin-top:10px; padding:5px 10px; cursor:pointer;">Close</button>
        `;
        notificationArea.appendChild(notif);

        const orderBooks = [...cart];

        cart.length = 0;
        updateCartUI();
        cartDropdown.classList.remove('show');

        saveOrder(orderBooks, total);

        setTimeout(() => {
            if (notif.parentElement) notif.remove();
        }, 5000);
    });

    function saveOrder(books, total) {
        const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        const order = {
            date: new Date().toLocaleString(),
            books: books,
            total: total
        };
        orders.unshift(order); 
        localStorage.setItem('orderHistory', JSON.stringify(orders));
    }

    function displayOrderHistory() {
        const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        const content = document.getElementById('orderHistoryContent');

        if (orders.length === 0) {
            content.innerHTML = `
                <div class="empty-history">
                    <div class="empty-history-icon">📦</div>
                    <h3>No Orders Yet</h3>
                    <p>Your order history will appear here after you make a purchase.</p>
                </div>
            `;
            return;
        }

        content.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-date">${order.date}</span>
                    <span class="order-total">$${order.total.toFixed(2)}</span>
                </div>
                <div class="order-books">
                    ${order.books.map(book => `
                        <div class="order-book">
                            ${book.coverUrl
                ? `<img src="${book.coverUrl}" alt="${book.title}" class="order-book-cover">`
                : '<div class="order-book-placeholder">📖</div>'
            }
                            <div class="order-book-info">
                                <span class="order-book-title">${book.title}</span>
                                <span class="order-book-price">$${book.price.toFixed(2)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    const orderHistoryBtn = document.getElementById('orderHistoryBtn');
    const orderHistoryModal = document.getElementById('orderHistoryModal');
    const closeOrderHistory = document.getElementById('closeOrderHistory');

    orderHistoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        displayOrderHistory();
        orderHistoryModal.classList.add('show');
    });

    closeOrderHistory.addEventListener('click', () => {
        orderHistoryModal.classList.remove('show');
    });

    orderHistoryModal.addEventListener('click', (e) => {
        if (e.target === orderHistoryModal) {
            orderHistoryModal.classList.remove('show');
        }
    });

    const themeBtn = document.getElementById('themeBtn');
    const savedTheme = localStorage.getItem('Theme');

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeBtn) themeBtn.textContent = '🌙';
    } else {
        if (themeBtn) themeBtn.textContent = '☀️';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');

            if (isLight) {
                localStorage.setItem('Theme', 'light');
                themeBtn.textContent = '🌙';
            } else {
                localStorage.setItem('Theme', 'dark');
                themeBtn.textContent = '☀️';
            }
        });
    }

    const userBubble = document.getElementById("userBubble");
    const username = localStorage.getItem("username");

    if (username && userBubble) {
        userBubble.textContent = username.charAt(0).toUpperCase() + username.slice(1);
    }

    function createShelf(containerId, books) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        const shelfDiv = document.createElement('div');
        shelfDiv.className = 'shelf';

        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book';

            if (!book.localPrice) {
                book.localPrice = '$' + (Math.random() * 20 + 5).toFixed(2);
            }
            const price = book.localPrice;

            const title = book.title;
            const coverObj = book.formats && book.formats['image/jpeg'];
            const coverUrl = coverObj ? coverObj : null;

            if (coverUrl) {
                bookDiv.innerHTML = `
                    <div class="book-cover" style="width: 120px; height: 180px; box-shadow: 2px 4px 6px rgba(0,0,0,0.3); transition: transform 0.3s; cursor: pointer;">
                        <img src="${coverUrl}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 2px;">
                    </div>
                    <div class="book-tag" style="text-align: center; margin-top: 8px; font-weight: bold; font-size: 0.9rem;">${price}</div>
                `;
            } else {
                const hue = Math.floor(Math.random() * 360);
                bookDiv.innerHTML = `
                    <div class="book-cover" style="width: 120px; height: 180px; background: linear-gradient(45deg, #222, hsl(${hue}, 70%, 50%)); display: flex; align-items: center; justify-content: center; box-shadow: 2px 4px 6px rgba(0,0,0,0.3); border-radius: 2px; cursor: pointer;">
                        <span style="padding: 10px; text-align: center; font-size: 0.8rem; color: #fff; text-shadow: 1px 1px 2px #000;">
                            ${title}
                        </span>
                    </div>
                    <div class="book-tag" style="text-align: center; margin-top: 8px; font-weight: bold; font-size: 0.9rem;">${price}</div>
                `;
            }

            bookDiv.addEventListener('click', () => {
                addToCart({ title: title, price: price, coverUrl: coverUrl });
            });

            shelfDiv.appendChild(bookDiv);
        });

        container.appendChild(shelfDiv);
    }

    const books = await fetchBooks();

    const searchBar = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');

    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        searchResults.innerHTML = '';

        if (query.length === 0) {
            searchResults.classList.remove('show');
            return;
        }

        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));

        if (filteredBooks.length > 0) {
            searchResults.classList.add('show');
            filteredBooks.slice(0, 10).forEach(book => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'search-item';

                if (!book.localPrice) {
                    book.localPrice = '$' + (Math.random() * 20 + 5).toFixed(2);
                }

                const coverObj = book.formats && book.formats['image/jpeg'];
                const coverUrl = coverObj ? coverObj : '';

                itemDiv.innerHTML = `
                    <div style="width: 40px; height: 60px; background: #333; display: flex; align-items: center; justify-content: center; margin-right: 10px; border-radius: 2px; overflow: hidden; flex-shrink: 0;">
                        ${coverUrl ? `<img src="${coverUrl}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover;">` : '<span style="font-size: 1.5rem; color: #555;">📖</span>'}
                    </div>
                    <div class="search-item-info">
                        <span class="search-item-title">${book.title}</span>
                        <span class="search-item-price">${book.localPrice}</span>
                    </div>
                `;

                itemDiv.addEventListener('click', () => {
                    addToCart({ title: book.title, price: book.localPrice, coverUrl: coverUrl });
                    searchBar.value = '';
                    searchResults.classList.remove('show');
                });

                searchResults.appendChild(itemDiv);
            });
        } else {
            searchResults.classList.remove('show');
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('show');
        }
    });

    function distributeBooks() {
        if (!books.length) return;
        const shelfContainer = document.querySelector('.bookshelf-container');
        const shelfWidth = shelfContainer ? shelfContainer.clientWidth : window.innerWidth;
        const bookWidth = 140;

        let booksPerShelf = Math.floor((shelfWidth - 40) / bookWidth);
        if (booksPerShelf < 1) booksPerShelf = 1;

        createShelf('shelf-1', books.slice(0, booksPerShelf));
        createShelf('shelf-2', books.slice(booksPerShelf, booksPerShelf * 2));
    }

    distributeBooks();

    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(distributeBooks, 200);
    });
});
