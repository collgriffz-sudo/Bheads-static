exports.handler = async (event) => {
  // Разрешаем только POST запросы (отправку данных)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { TG_BOT_TOKEN, TG_CHAT_ID } = process.env;
  
try {
    const data = JSON.parse(event.body);
    const message = `🚀 **НОВЫЙ ЗАКАЗ**\n👤 Имя: ${data.name}\n📞 Тел: ${data.phone}\n💰 Сумма: ${data.totalPrice}`;

    console.log("Попытка отправки в Telegram...");
    console.log("Чат ID:", TG_CHAT_ID);

    const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      }),
    });

    const result = await response.json();
    console.log("Ответ от Telegram:", JSON.stringify(result));

    if (response.ok) {
      return { statusCode: 200, body: JSON.stringify({ status: "success" }) };
    } else {
      console.error("Telegram вернул ошибку:", result.description);
      return { statusCode: 500, body: JSON.stringify(result) };
    }
  } catch (error) {
    console.error("Критическая ошибка функции:", error);
    return { statusCode: 500, body: error.toString() };
  }
};
