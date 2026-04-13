export async function onRequestPost(context) {
  try {
    // 1. Читаем JSON (в Cloudflare это делается через .json(), а не event.body)
    const data = await context.request.json();
    
    // 2. Достаем ключи из настроек Cloudflare (Variables)
    const token = context.env.TELEGRAM_TOKEN;
    const chatId = context.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return new Response('Ошибка: Токен или ChatID не настроены в панели Cloudflare', { status: 500 });
    }

    // 3. Формируем заголовок заказа
    const orderNum = data.orderNumber || 'БЕЗ НОМЕРА';
    let message = `BHeads7.ru 📦 **ЗАКАЗ №${orderNum}**\n`;
    message += `──────────────────\n`;

    // 4. Перебираем ВСЕ поля (как в твоем старом коде)
    for (const key in data) {
      if (['cartItems', 'orderNumber'].includes(key)) continue;
      
      const label = key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
      
      let value = data[key];
      if (value === true) value = "✅ Да";
      if (value === false) value = "❌ Нет";
      
      message += `**${label}**: ${value}\n`;
    }

    // 5. Добавляем список товаров
    if (data.cartItems && Array.isArray(data.cartItems)) {
      message += `──────────────────\n`;
      message += `🛒 **ТОВАРЫ:**\n`;
      data.cartItems.forEach(item => {
        message += `• ${item.name} — ${item.quantity} шт. (${item.price} руб.)\n`;
      });
    }

    // 6. Отправка в Telegram
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown' // Твой старый код использовал Markdown
      })
    });

    if (!response.ok) {
        return new Response('Ошибка Telegram API', { status: 500 });
    }

    return new Response(JSON.stringify({ status: "success" }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response('Ошибка сервера: ' + err.message, { status: 500 });
  }
}
