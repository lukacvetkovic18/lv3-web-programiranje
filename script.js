"use strict";

// Define items
const items = [
    {
        name: 'Apple',
        price: 5,
        category: 'fruit'
    },
    {
        name: 'Banana',
        price: 10,
        category: 'fruit'
    },
    {
        name: 'Peach',
        price: 6,
        category: 'fruit'
    },
    {
        name: 'Pear',
        price: 8,
        category: 'fruit'
    },
    {
        name: 'Cherry',
        price: 12,
        category: 'fruit'
    },
    {
        name: 'Pineapple',
        price: 7,
        category: 'fruit'
    },
    {
        name: 'Orange',
        price: 4,
        category: 'fruit'
    },
    {
        name: 'Apricot',
        price: 8,
        category: 'fruit'
    },
    {
        name: 'Tomato',
        price: 5,
        category: 'vegetable'
    },
    {
        name: 'Potato',
        price: 10,
        category: 'vegetable'
    },
    {
        name: 'Cabbage',
        price: 6,
        category: 'vegetable'
    },
    {
        name: 'Carrot',
        price: 7,
        category: 'vegetable'
    },
    {
        name: 'Onion',
        price: 9,
        category: 'vegetable'
    },
    {
        name: 'Mushroom',
        price: 12,
        category: 'vegetable'
    },
    {
        name: 'Pumpkin',
        price: 6,
        category: 'vegetable'
    },
    {
        name: 'Broccoli',
        price: 11,
        category: 'vegetable'
    },
];

let walletAmount = 100;
let total = 0;
let shoppingCart = [];
let itemsToDisplay = items;

// Function to dynamically create item elements in the HTML
function createItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.innerHTML = `
        <h2>${ item.name }</h2>
        <img src="assets/${item.name.toLowerCase()}.png" alt="${item.name}" class="item-image">
        <p>Price: $${item.price}</p>
        <div class="add-item-container">
            <div class="quantity">
                <button class="decrement">-</button>
                <span class="amount">0</span>
                <button class="increment">+</button>
            </div>
            <button disabled class="add-to-cart-btn" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
        </div>
    `;
    return itemElement;
}

// Function to display items in the grid
function displayItems() {
    const itemsGrid = document.querySelector('.items-grid');
    itemsGrid.innerHTML = '';

    itemsToDisplay.forEach(item => {
        const itemElement = createItemElement(item);
        itemsGrid.appendChild(itemElement);
    });
}

function updateWalletAmount() {
    const walletAmountSpan = document.querySelector('.wallet-amount');
    walletAmountSpan.textContent = `Your wallet amount: $${walletAmount.toFixed(2)}`;
}

// Function to initialize the web shop
function initWebShop() {
    handleSortChange();
    updateWalletAmount();
}

// Function to handle sorting based on the selected option
function handleSortChange() {
    const sortDropdown = document.getElementById('sort-dropdown');
    const selectedOption = sortDropdown.value;

    switch (selectedOption) {
        case 'name-desc':
            sortItemsByNameDesc();
            break;
        case 'price-desc':
            sortItemsByPriceDesc();
            break;
        case 'price-asc':
            sortItemsByPriceAsc();
            break;
        default:
            sortItemsByNameAsc();
            break;
    }
}

// Function to sort items alphabetically by name in descending order (Z-A)
function sortItemsByNameDesc() {
    itemsToDisplay.sort((a, b) => b.name.localeCompare(a.name));
    displayItems();
}

// Function to sort items alphabetically by name in ascending order (A-Z) - default
function sortItemsByNameAsc() {
    itemsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
    displayItems();
}

// Function to sort items by price in descending order (Highest Price)
function sortItemsByPriceDesc() {
    itemsToDisplay.sort((a, b) => b.price - a.price);
    displayItems();
}

// Function to sort items by price in ascending order (Lowest Price)
function sortItemsByPriceAsc() {
    itemsToDisplay.sort((a, b) => a.price - b.price);
    displayItems();
}

function handleFilterChange() {
    const filterDropdown = document.getElementById('filter-dropdown');
    const selectedCategory = filterDropdown.value;

    if (selectedCategory === 'all') {
        itemsToDisplay = items;
        handleSortChange();
    } else {
        itemsToDisplay = items.filter(item => item.category === selectedCategory);
        handleSortChange();
    }
}

// Function to update the cart badge count
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    cartBadge.textContent = shoppingCart.length;
}

// Function to add an item to the cart
function addToCart(itemName, amount) {
    amount = parseInt(amount, 10);
    if(typeof itemName === "string" && typeof amount === "number") {
        if(amount < 1) {
            alert("Entered amount has to be higher than 0.");
            return;
        }
        const index = items.findIndex((item) => item.name === itemName);
        if(index === -1) {
            alert("Item not found.");
            return;
        }
        const item = items[index];
        const itemIndexInCart = shoppingCart.findIndex((item) => item.name === itemName);
        const totalPrice = amount * item.price;
        if (walletAmount >= totalPrice) {
            walletAmount -= totalPrice;
            if(itemIndexInCart !== -1) {
                shoppingCart[itemIndexInCart].amount += amount;
                shoppingCart[itemIndexInCart].totalPrice += totalPrice;
            } else {
                shoppingCart.push({
                    name: itemName,
                    price: item.price,
                    amount: amount,
                    totalPrice: totalPrice
                });
            }
            total += totalPrice;
            console.log(`Buying ${item.name} with amount ${amount}`);
            console.log(`Your remaining wallet amount: ${walletAmount}$`);
        } else {
            alert('Not enough money');
            return;
        }
    } else {
        alert("Item name has to be type string and amount has to be type number.");
    }
    updateCartBadge();
    updateWalletAmount();
}

function removeFromCart(itemName, amount) {
    if(typeof itemName === "string") {
        if(amount === undefined) {
            const itemIndexInCart = shoppingCart.findIndex((item) => item.name === itemName);
            if(itemIndexInCart === -1) {
                alert("Item not found.");
                return;
            }
            const item = shoppingCart[itemIndexInCart];
            shoppingCart = shoppingCart.filter((item) => item.name !== itemName);
            walletAmount += item.totalPrice; 
            total -= item.totalPrice;
            console.log(`Removing ${itemName} from cart.`);
            console.log(`Your remaining wallet amount: ${walletAmount}$`);
        } else {
            amount = parseInt(amount, 10);
            if(typeof amount === "number") {
                if(amount < 1) {
                    alert("Entered amount has to be higher than 0.");
                    return;
                }
                const itemIndexInCart = shoppingCart.findIndex((item) => item.name === itemName);
                if(shoppingCart[itemIndexInCart].amount >= amount){
                    shoppingCart[itemIndexInCart].amount -= amount;
                    const totalPrice = amount * shoppingCart[itemIndexInCart].price;
                    shoppingCart[itemIndexInCart].totalPrice -= totalPrice;
                    total -= totalPrice;
                    walletAmount += totalPrice; 
                    if (shoppingCart[itemIndexInCart].amount === 0) {
                        shoppingCart = shoppingCart.filter((item) => item.name !== itemName);
                    }
                    console.log(`Removing from cart ${amount} items of ${itemName}`);
                    console.log(`Your remaining wallet amount: ${walletAmount}$`);
                } else {
                    alert("Entered amount has to be lower than the amount in the shopping cart.");
                }
            } else {
                alert("Amount has to be type number.");
            }
        }
    } else {
        alert("Item name has to be type string.");
    }
    updateCartBadge();
    updateCartModal();
    updateWalletAmount();
}

// Function to handle the buy action
function buyItems() {
    alert('Purchase successful!');
    
    walletAmount = 100;
    total = 0;
    shoppingCart = [];
    
    updateCartBadge();
    updateCartModal();
    updateWalletAmount();
    
    const buyButton = document.querySelector('.buy-button');
    buyButton.disabled = true;
}

// Function to show the modal
function showModal() {
    const modal = document.querySelector('.modal');
    modal.classList.add('show-modal');
}

// Function to hide the modal
function hideModal() {
    const modal = document.querySelector('.modal');
    modal.classList.remove('show-modal');
}

// Function to update the cart items list in the modal
function updateCartModal() {
    const cartItemsTable = document.querySelector('.cart-items tbody');
    cartItemsTable.innerHTML = '';

    if (shoppingCart.length === 0) {
        const emptyCartRow = document.createElement('tr');
        emptyCartRow.innerHTML = '<td colspan="5">Your shopping cart is empty!</td>';
        cartItemsTable.appendChild(emptyCartRow);
    } else {
        shoppingCart.forEach((item) => {
            const cartItemRow = document.createElement('tr');

            const itemNameCell = document.createElement('td');
            itemNameCell.textContent = item.name;
            cartItemRow.appendChild(itemNameCell);

            const itemPriceCell = document.createElement('td');
            itemPriceCell.textContent = `$${item.price}`;
            cartItemRow.appendChild(itemPriceCell);

            const itemQuantityCell = document.createElement('td');
            itemQuantityCell.textContent = item.amount;
            cartItemRow.appendChild(itemQuantityCell);

            const itemTotalCell = document.createElement('td');
            itemTotalCell.textContent = `$${item.totalPrice}`;
            cartItemRow.appendChild(itemTotalCell);

            const itemActionsCell = document.createElement('td');
            const decrementButton = document.createElement('button');
            decrementButton.textContent = '-';
            decrementButton.classList.add('modal-decrement');
            itemActionsCell.appendChild(decrementButton);

            const amountDisplay = document.createElement('span');
            amountDisplay.textContent = '0';
            amountDisplay.classList.add('modal-remove-amount');
            itemActionsCell.appendChild(amountDisplay);

            const incrementButton = document.createElement('button');
            incrementButton.textContent = '+';
            incrementButton.classList.add('modal-increment');
            itemActionsCell.appendChild(incrementButton);

            const removeAmountButton = document.createElement('button');
            removeAmountButton.textContent = 'Remove Amount';
            removeAmountButton.classList.add('remove-amount-btn');
            removeAmountButton.disabled = true;
            removeAmountButton.dataset.name = item.name;
            itemActionsCell.appendChild(removeAmountButton);

            const removeAllButton = document.createElement('button');
            removeAllButton.textContent = 'Remove All';
            removeAllButton.classList.add('remove-all-btn');
            removeAllButton.dataset.name = item.name;
            itemActionsCell.appendChild(removeAllButton);

            cartItemRow.appendChild(itemActionsCell);

            cartItemsTable.appendChild(cartItemRow);
        });
    }

    const cartTotal = document.querySelector('.cart-total');
    cartTotal.textContent = `$${total.toFixed(2)}`;

    const buyButton = document.querySelector('.buy-btn');
    buyButton.disabled = shoppingCart.length === 0;

    buyButton.addEventListener('click', buyItems);
}


// Function to handle clicking on the "Cart" button
function handleCartButtonClick() {
    showModal();
    updateCartModal();
}

// Initialize the web shop when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    initWebShop();
    
    const sortDropdown = document.getElementById('sort-dropdown');
    sortDropdown.addEventListener('change', handleSortChange);
    
    const filterDropdown = document.getElementById('filter-dropdown');
    filterDropdown.addEventListener('change', handleFilterChange);

    const cartButton = document.querySelector('.cart-button');
    cartButton.addEventListener('click', handleCartButtonClick);

    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', hideModal);
});
// Event listener for increment button clicks
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('increment')) {
        const amountSpan = event.target.parentElement.querySelector('.amount');
        let amount = parseInt(amountSpan.textContent);
        amount++;
        amountSpan.textContent = amount;

        const addToCartButton = event.target.parentElement.parentElement.querySelector('.add-to-cart-btn');
        addToCartButton.disabled = false;
    }
});

// Event listener for decrement button clicks
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('decrement')) {
        const amountSpan = event.target.parentElement.querySelector('.amount');
        let amount = parseInt(amountSpan.textContent);
        if (amount > 0) {
            amount--;
            amountSpan.textContent = amount;

            const addToCartButton = event.target.parentElement.parentElement.querySelector('.add-to-cart-btn');
            if (amount === 0) {
                addToCartButton.disabled = true;
            }
        }
    }
});
// Event listener for add to cart button clicks
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const itemName = event.target.getAttribute('data-name');
        const quantitySpan = event.target.parentElement.querySelector('.quantity .amount');
        const amount = parseInt(quantitySpan.textContent);
        addToCart(itemName, amount);
        quantitySpan.textContent = '0';
        event.target.disabled = true;
    }
});

// Event listener for decrement button clicks within the cart modal
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal-decrement')) {
        const amountDisplay = event.target.nextElementSibling;
        let amount = parseInt(amountDisplay.textContent);
        if (amount > 0) {
            amount--;
            amountDisplay.textContent = amount;

            const removeFromCartButton = event.target.parentElement.parentElement.querySelector('.remove-amount-btn');
            if (amount === 0) {
                removeFromCartButton.disabled = true;
            }
        }
    }
});

// Event listener for increment button clicks within the cart modal
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal-increment')) {
        const amountDisplay = event.target.previousElementSibling;
        let amount = parseInt(amountDisplay.textContent);
        amount++;
        amountDisplay.textContent = amount;

        const removeFromCartButton = event.target.parentElement.parentElement.querySelector('.remove-amount-btn');
        removeFromCartButton.disabled = false;
    }
});

// Event listener for removing specific amount of items
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-amount-btn')) {
        const itemName = event.target.dataset.name;
        const amountDisplay = event.target.parentElement.querySelector('.modal-remove-amount');
        const amount = parseInt(amountDisplay.textContent);
        removeFromCart(itemName, amount);
        event.target.disabled = true;
    }
});

// Event listener for removing all items of a specific type
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-all-btn')) {
        const itemName = event.target.dataset.name;
        removeFromCart(itemName);
    }
});