// Универсальная логика корзины
function addToCart(name, price, quantity, img, url) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Если путь к картинке относительный (начинается с ..), чистим его для корзины
    let cleanImg = img ? img.replace('../', '') : '';

    let existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: name,
            price: parseInt(price),
            quantity: parseInt(quantity),
            img: cleanImg,
            url: url
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    alert('Товар добавлен в корзину!');
}

function updateCartCounter() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Ищем счетчик в шапке (подходит для твоего index.htm и карточек)
    let countElem = document.querySelector('.cart__count') || document.getElementById('cart-count');
    if (countElem) {
        countElem.innerText = totalCount;
    }
}

// Удаление товара
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    if (typeof displayCart === 'function') displayCart(); // Если мы на странице корзины
    updateCartCounter();
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', updateCartCounter);

