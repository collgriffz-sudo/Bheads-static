exports.handler = async (event) => {
  // Разрешаем только POST запросы (отправку данных)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { TG_BOT_TOKEN, TG_CHAT_ID } = process.env;
  
  try {
    const data = JSON.parse(event.body);

    // Собираем текст сообщения. 
    // Данные (name, phone и т.д.) мы чуть позже настроим в файле корзины
    const message = `
🚀 **НОВЫЙ ЗАКАЗ С САЙТА**
━━━━━━━━━━━━━━━━━━
👤 **Имя:** ${data.name || 'Не указано'}
📞 **Телефон:** ${data.phone || 'Не указано'}
🏠 **Адрес:** ${data.address || 'Не указано'}
💰 **Сумма:** ${data.totalPrice} руб.

🛒 **ТОВАРЫ:**
${data.itemsSummary || 'Список пуст'}
━━━━━━━━━━━━━━━━━━
    `;

    // Отправляем в Telegram через стандартный fetch
    const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      }),
    });

    if (response.ok) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: "success" }) 
      };
    } else {
      return { statusCode: 500, body: "Ошибка Telegram API" };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};