// ========== КОРЗИНА ДЛЯ СТАТИЧЕСКОГО САЙТА ==========
(function() {
    // Получить корзину
    function getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }
    
    // Сохранить корзину
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();  // Обновляем счётчик при сохранении
    }
    
    // Добавить товар (с объединением одинаковых и учётом количества)
    window.addToCart = function(name, price, quantity = 1, img = '', url = '') {
        let cart = getCart();
        let existing = cart.find(item => item.name === name);
        
        if (existing) {
            existing.quantity = (existing.quantity || 1) + quantity;
        } else {
            cart.push({ name: name, price: price, quantity: quantity, img: img, url: url });
        }
        
        saveCart(cart);
        alert('✓ Товар "' + name + '" добавлен в корзину');
    };
    
    // Удалить товар (уменьшить количество или удалить полностью)
    window.removeFromCart = function(index) {
        let cart = getCart();
        let item = cart[index];
        
        if (item.quantity > 1) {
            // Уменьшаем количество
            item.quantity--;
        } else {
            // Удаляем товар
            cart.splice(index, 1);
        }
        
saveCart(cart);
        location.reload();
    };
    
    // Очистить корзину
    window.clearCart = function() {
if (confirm('Очистить корзину?')) {
            saveCart([]);
            location.reload();
        }
    };
    
    // Обновить счётчик в шапке (общее количество товаров)
    function updateCartCount() {
        let cart = getCart();
        let totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        let countElem = document.querySelector('.cart__count');
        if (countElem) {
            countElem.innerText = totalCount;
        }
    }
    
    // Отобразить корзину на странице cart.html
    function displayCartPage() {
        let cart = getCart();
        let container = document.querySelector('.cartItems');
        if (!container) return;
        
        if (cart.length === 0) {
            container.innerHTML = `
                <div class="attention" style="text-align:center; padding:40px;">
                    <p>Корзина пуста</p>
                    <a href="catalog.html" class="button" style="display:inline-block; margin-top:15px;">Перейти в каталог</a>
                </div>
            `;
            let orderBlock = document.getElementById('order-block');
            if (orderBlock) orderBlock.style.display = 'none';
            return;
        }
        
        let itemsHtml = '<div style="margin:20px 0;">';
        let total = 0;
        
        cart.forEach((item, index) => {
            let priceNum = parseInt(item.price) || 0;
            let quantity = item.quantity || 1;
            let itemTotal = priceNum * quantity;
            total += itemTotal;
            itemsHtml += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid #eee;">
                    <div style="flex:2; display:flex; align-items:center; gap:15px;">
                        <img src="${item.img || 'images/no-photo.jpg'}" alt="" style="width:60px; height:60px; object-fit:contain; border-radius:4px; border:1px solid #eee;">
                        <div>
                            <strong style="display:block;">${escapeHtml(item.name)}</strong>
                            <div style="font-size:0.75rem; color:#aca7b4;">${priceNum.toLocaleString()} ₽ за шт.</div>
                        </div>
                    </div>

              <div style="flex:1; display:flex; align-items:center; justify-content:center; gap:10px;">
    <button type="button" onclick="window.changeQty(${index}, -1)" style="width:28px; height:28px; border:1px solid #ccc; background:#fff; color:#000; border-radius:4px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; padding:0; line-height:1;">
        &minus;
    </button>
    
    <span style="font-weight:bold; min-width:25px; text-align:center; color:#000; font-size:15px;">${quantity}</span>
    
    <button type="button" onclick="window.changeQty(${index}, 1)" style="width:28px; height:28px; border:1px solid #ccc; background:#fff; color:#000; border-radius:4px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; padding:0; line-height:1;">
        &plus;
    </button>
</div>

                    <div style="flex:1; text-align:right; font-weight:bold;">
                        ${itemTotal.toLocaleString()} ₽
                    </div>

                    <div style="flex:0 0 80px; text-align:right;">
                        <button onclick="window.changeQty(${index}, -${quantity})" style="background:none; border:none; color:#999; font-size:12px; font-style:italic; cursor:pointer; padding:0 0 2px 0; font-family:inherit; border-bottom:1px solid #999; line-height:1; transition:all 0.2s;" onmouseover="this.style.color='#ff4444'; this.style.borderColor='#ff4444'" onmouseout="this.style.color='#999'; this.style.borderColor='#999'">
    удалить
</button>
                    </div>
                </div>
            `;
        });
        
        itemsHtml += `
            <div style="text-align:right; padding:15px 0; font-size:1.2em; font-weight:bold; border-top:2px solid #ddd;">
                Итого: ${total.toLocaleString()} ₽
            </div>
        </div>`;
        
        let orderHtml = `
        <div style="text-align:center; margin-top:30px;">
            <button type="button" id="openOrderBtn" style="background:#b30020; color:#fff; border:none; padding:18px 50px; border-radius:35px; font-size:1.2rem; font-weight:bold; cursor:pointer; width:100%; max-width:400px; box-shadow:0 5px 20px rgba(179,0,32,0.3);">
                ОФОРМИТЬ ЗАКАЗ
            </button>
        </div>
    `;
    
    container.innerHTML = itemsHtml + orderHtml;

    // Привязываем кнопку к окну
    setTimeout(() => {
        const btn = document.getElementById('openOrderBtn');
        if (btn) {
            btn.onclick = function() {
                const modal = document.getElementById('orderModal');
                if (modal) modal.style.display = 'flex';
                else alert('Окно оформления не найдено');
            };
        }
    }, 100);
        
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
// Запуск при загрузке страницы
    document.addEventListener('DOMContentLoaded', function() {
        updateCartCount();
        displayCartPage();
    });
    // Глобальная функция изменения количества
    window.changeQty = function(index, delta) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cart[index]) {
            let currentQty = parseInt(cart[index].quantity) || 1;
            let newQty = currentQty + delta;

            if (newQty < 1) {
                if (confirm("Удалить этот товар из корзины?")) {
                    cart.splice(index, 1);
                } else {
                    return; 
                }
            } else {
                cart[index].quantity = newQty;
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Обновляем счётчик в шапке
            updateCartCount(); 
            
            // ВАЖНО: вызываем ПРАВИЛЬНОЕ название функции отрисовки
            displayCartPage(); 
        }
    };
})();

// Основная функция перехода по шагам
window.nextStep = function(step) {
    // Скрываем все шаги
    document.querySelectorAll('.order-step').forEach(el => el.style.display = 'none');
    // Показываем нужный
    const target = document.getElementById('step' + step);
    if (target) {
        target.style.display = 'block';
        // Прокручиваем модальное окно вверх, чтобы новый шаг был виден с начала
        document.getElementById('orderModal').querySelector('div').scrollTop = 0;
    }
};

window.prepareReview = function() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let totalPrice = cart.reduce((sum, item) => sum + (parseInt(item.price) * (item.quantity || 1)), 0);

    // Достаем цену доставки из атрибута data-price выбранной кнопки
    const shipEl = document.querySelector('input[name="deliveryType"]:checked');
    const shipPrice = parseInt(shipEl?.getAttribute('data-price') || 0);
    const deliveryName = shipEl?.value || 'Не выбрана';
    const grandTotal = totalPrice + shipPrice;

    // --- ОБНОВЛЕННЫЙ БЛОК ОТОБРАЖЕНИЯ ТОВАРОВ С КАРТИНКОЙ ---
    let itemsHTML = `
        <div style="font-weight:bold; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">🛒 Ваш заказ:</div>
        <table style="width:100%; border-collapse:collapse; font-size:0.85rem; margin-bottom:15px;">
    `;

    cart.forEach(item => {
        let p = parseInt(item.price) || 0;
        let q = item.quantity || 1;
        let imgTag = `<img src="${item.img || 'images/no-photo.jpg'}" style="width:40px; height:40px; object-fit:contain; border-radius:4px; border:1px solid #eee;">`;

        itemsHTML += `
            <tr style="border-bottom:1px solid #f0f0f0;">
                <td style="padding:8px 0; width:45px; vertical-align:middle;">${imgTag}</td>
                <td style="padding:8px 5px; vertical-align:middle;">
                    <div style="font-weight:500; line-height:1.2;">${item.name}</div>
                    <div style="font-size:0.75rem; color:#888;">${q} шт.</div>
                </td>
                <td style="padding:8px 0; text-align:right; font-weight:bold; vertical-align:middle; white-space:nowrap;">
                    ${(p * q).toLocaleString()} ₽
                </td>
            </tr>
        `;
    });

    // Вставляем строку доставки и считаем общий ИТОГ
    itemsHTML += `
        <tr>
            <td colspan="2" style="padding:10px 0 5px 0; color:#666;">Доставка: ${deliveryName}</td>
            <td style="padding:10px 0 5px 0; text-align:right; color:#666;">+ ${shipPrice.toLocaleString()} ₽</td>
        </tr>
        <tr>
            <td colspan="2" style="padding:10px 0; font-weight:bold; font-size:1rem;">Итого к оплате:</td>
            <td style="padding:10px 0; text-align:right; font-weight:bold; color:#b30020; font-size:1.1rem;">
                <span id="finalTotal">${grandTotal}</span> ₽
            </td>
        </tr>
    </table>
    `;

    const cartContainer = document.getElementById('finalCartItems');
    if (cartContainer) {
        cartContainer.innerHTML = itemsHTML;
    }

    // --- БЛОК ДАННЫХ ПОЛУЧАТЕЛЯ (оставляем как было) ---
    const name = document.getElementById('orderName').value || 'Не указано';
    const phone = document.getElementById('orderPhone').value || 'Не указано';
    const email = document.getElementById('orderEmail').value || 'Не указано';
    const receiver = document.getElementById('orderReceiver').value || 'Не указано';
    const address = document.getElementById('orderAddress').value || 'Не указано';
    const comment = document.getElementById('orderComment').value || '—';
    
    const delivery = document.querySelector('input[name="deliveryType"]:checked')?.value || 'Не выбрано';
    const payment = document.querySelector('input[name="payType"]:checked')?.value || 'Не выбрано';

    const reviewHTML = `
        <div style="border-top: 1px solid #ddd; padding-top: 10px;">
            <strong style="color: #b30020;">📍 Контактные данные:</strong><br>
            ФИО: ${name}<br>
            Тел: ${phone}<br>
            Email: ${email}
        </div>
        <div style="margin-top:10px;">
            <strong style="color: #b30020;">📦 Получатель и адрес:</strong><br>
            Кому: ${receiver}<br>
            Куда: ${address}
        </div>
        <div style="margin-top:10px;">
            <strong>🚚 Доставка:</strong> ${delivery}
        </div>
        <div style="margin-top:10px;">
            <strong>💳 Способ оплаты:</strong> ${payment}
        </div>
        <div style="margin-top:5px; font-size:0.85rem; color:#666;">
            <strong>💬 Комментарий:</strong> ${comment}
        </div>
    `;

    document.getElementById('finalReview').innerHTML = reviewHTML;
    
    nextStep(4);
};

function showPaymentDetails(paymentMethod) {
    const container = document.getElementById('paymentContent');
    if (container) {
        // РАСШИРЯЕМ ВШИРЬ:
        container.style.width = '100%';
        container.style.minWidth = '380px'; // Чтобы виджет CryptoCloud не сжимался по бокам
        container.style.minHeight = '450px'; 
        
        // Находим само белое модальное окно и тоже даем ему ширину
        const modalMain = container.closest('.modal-content') || container.parentElement;
        if (modalMain) {
            modalMain.style.width = '95%';
            modalMain.style.maxWidth = '500px'; // Делаем само окно шире, чтобы форма влезла
        }
    }
    
    if (!container) return;
    container.innerHTML = '';

    // Получаем чистую сумму (только цифры)
    const totalElement = document.getElementById('finalTotal');
    const sum = totalElement ? totalElement.innerText.replace(/\D/g, '') : '0';

    if (paymentMethod.includes("СБП")) {
        container.innerHTML = `
            <div style="padding: 15px; background: #e3f2fd; border-radius: 8px; border: 1px solid #2196f3;">
                <strong>Реквизиты СБП:</strong><br>
                Сумма к переводу: <b>${sum} ₽</b><br>
                Номер: +7 (922) 371-74-16<br>
                Банк: ЮМани<br>
                Получатель: Богдан Н.
            </div>`;

    } else if (paymentMethod.includes("Юмани")) {
        // Твой Iframe ЮMoney (сумма подставляется автоматически)
        container.innerHTML = `
            <div style="text-align: center;">
                <iframe src="https://yoomoney.ru/quickpay/shop-widget?writer=seller&targets-hint=&default-sum=${sum}&button-text=02&payment-type-choice=on&hint=&successURL=https://lordtitle.ru/thanks.html&quickpay=shop&account=410016056320201" 
                width="100%" height="250" frameborder="0" allowtransparency="true" scrolling="no"></iframe>
            </div>`;

    } else if (paymentMethod.includes("Карты")) {
        // Твой Iframe ЮMoney (сумма подставляется автоматически)
        container.innerHTML = `
            <div style="text-align: center;">
                <iframe src="https://yoomoney.ru/quickpay/shop-widget?writer=seller&targets-hint=&default-sum=${sum}&button-text=02&payment-type-choice=on&hint=&successURL=https://lordtitle.ru/thanks.html&quickpay=shop&account=410016056320201" 
                width="100%" height="250" frameborder="0" allowtransparency="true" scrolling="no"></iframe>
            </div>`;
        
    } else if (paymentMethod.includes("Криптовалюта")) {
        // Виджет CryptoCloud
        container.innerHTML = `
            <div id="crypto-widget-container">
                <vue-widget 
                    shop_id="7zTuAWJTvjF0Vf9A" 
                    api_key="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiTWpjMk5nPT0iLCJ0eXBlIjoicHJvamVjdCIsInYiOiJlNjc2ODU0ZGNmYjFkODBhMTk1NGMyNzQ1ZWYxOGY5MmNmYWE1ZDBlNDRiMjFkNDcwOWU4Y2FiZWNmODdlNmVmIiwiZXhwIjo4ODExMDU4NjA1NX0.xbWPetI-mvot4yzjfXM4ksJ0O8NE4OnXVKIk5xOC7mc" 
                    currency="RUB" 
                    amount="${sum}" 
                    locale="ru">
                </vue-widget>
            </div>`;
        
        // Перезагружаем скрипт виджета, чтобы он "увидел" новый элемент
        const script = document.createElement('script');
        script.src = "https://api.cryptocloud.plus/static/widget/v2/js/app.js";
        document.body.appendChild(script);
    }
}

function generateOrderNumber() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // Формат: ДеньМесяц-ЧасыМинуты (например, 1204-1545)
    return `${day}${month}-${hours}${minutes}`;
}

// Функция, которая срабатывает при нажатии на "ВСЁ ВЕРНО, ЗАКАЗЫВАЮ!"
window.finishAndShowPayment = function() {
    // 1. Генерируем номер заказа
    const orderID = generateOrderNumber();
    
    // --- СБОР ДАННЫХ ДЛЯ TELEGRAM (Ничего не сломает) ---
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalPrice = cart.reduce((sum, item) => sum + (parseInt(item.price) * (item.quantity || 1)), 0);

    const orderData = {
        orderNumber: orderID,
        name: document.getElementById('orderName')?.value || 'Не указано',
        phone: document.getElementById('orderPhone')?.value || 'Не указано',
        email: document.getElementById('orderEmail')?.value || 'Не указано',
        receiver: document.getElementById('orderReceiver')?.value || 'Не указано',
        address: document.getElementById('orderAddress')?.value || 'Не указано',
        delivery: document.querySelector('input[name="deliveryType"]:checked')?.value || 'Не выбрано',
        payment: document.querySelector('input[name="payType"]:checked')?.value || 'Не выбрано',
        comment: document.getElementById('orderComment')?.value || '—',
        // Берем сумму прямо с экрана (из того самого поля finalTotal, где уже есть доставка)
totalPrice: (document.getElementById('finalTotal')?.innerText.replace(/\D/g, '') || totalPrice) + " ₽",
        cartItems: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }))
    };

/* // Отправляем "почтальону" в Netlify
    fetch('/.netlify/functions/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(response => console.log("Данные ушли в Netlify"))
    .catch(error => console.error("Ошибка отправки в Telegram:", error));
    */

    // Новый код для Cloudflare
    fetch('/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (response.ok) {
            console.log("Заказ успешно отправлен в Cloudflare");
        }
    })
    .catch(error => console.error("Ошибка отправки:", error));

    // --- КОНЕЦ БЛОКА TELEGRAM ---

    // 2. Подставляем номер в заголовок на 5-м шаге
    const titleElement = document.querySelector('#step5 h2');
    if (titleElement) {
        titleElement.innerHTML = `✅ Заказ №${orderID} принят!`;
    }

    // Находим кнопки WhatsApp и Email по их ID
    const waLink = document.getElementById('whatsappLink');
    const emailLink = document.getElementById('emailLink');
    
    if (waLink) {
        waLink.href = `https://wa.me/79001234567?text=Здравствуйте! Фото к заказу №${orderID}`;
    }
    if (emailLink) {
        emailLink.href = `mailto:support@lordtitle.ru?subject=Фото к заказу №${orderID}`;
    }

    // 3. Собираем способ оплаты для показа инструкции
    const paymentMethod = document.querySelector('input[name="payType"]:checked')?.value || 'Не выбрано';
    
    showPaymentDetails(paymentMethod);
    nextStep(5);

    // Прячем крестик
    const closeBtn = document.querySelector('.close'); 
    if (closeBtn) closeBtn.style.display = 'none';

    console.log("Заказ под номером " + orderID + " оформлен");
}

/// Функция закрытия (теперь только для рабочих шагов 1-4)
window.closeOrderModal = function() {
    const modal = document.getElementById('orderModal');
    const step5 = document.getElementById('step5');

    // Если мы на финальном шаге — чистим и валим на главную
    if (step5 && step5.style.display === 'block') {
        localStorage.setItem('cart', '[]');
        window.location.href = 'index.html'; 
    } else {
        // На остальных этапах просто закрываем окно
        if (modal) modal.style.display = 'none';
    }
}

// Закрытие при клике на темный фон (вне формы)
window.addEventListener('click', function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target == modal) {
        window.closeOrderModal();
    }
});

// Функция для полного выхода после заказа
window.finalExit = function() {
    console.log("Очистка корзины и выход...");
    
    // 1. Очищаем корзину в памяти
    localStorage.setItem('cart', '[]');
    
    // 2. Сбрасываем шаг на первый (на всякий случай для будущего)
    if (window.nextStep) {
        window.nextStep(1);
    }
    
    // 3. Уходим на главную
    window.location.href = 'index.html'; 
};
