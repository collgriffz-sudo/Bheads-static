exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const { TG_BOT_TOKEN, TG_CHAT_ID } = process.env;
  
  try {
    const data = JSON.parse(event.body);
    
    // Заголовок с номером заказа (если он есть в данных)
    const orderNum = data.orderNumber || 'БЕЗ НОМЕРА';
    let message = `📦 **ЗАКАЗ №${orderNum}**\n`;
    message += `──────────────────\n`;

    // Перебираем ВСЕ поля, кроме товаров и служебных данных
    for (const key in data) {
      if (['cartItems', 'orderNumber'].includes(key)) continue;
      
      // Красивое название поля: заменяем подчеркивания на пробелы и делаем заглавную букву
      const label = key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
      
      // Если это чекбокс (true/false), пишем "Да/Нет"
      let value = data[key];
      if (value === true) value = "✅ Да";
      if (value === false) value = "❌ Нет";
      
      message += `**${label}**: ${value}\n`;
    }

    // Добавляем список товаров
    if (data.cartItems && Array.isArray(data.cartItems)) {
      message += `──────────────────\n`;
      message += `🛒 **ТОВАРЫ:**\n`;
      data.cartItems.forEach(item => {
        message += `• ${item.name} — ${item.quantity} шт. (${item.price} руб.)\n`;
      });
    }

    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      }),
    });

    return { statusCode: 200, body: JSON.stringify({ status: "success" }) };
  } catch (error) {
    console.error("Ошибка:", error);
    return { statusCode: 500, body: error.toString() };
  }
};
