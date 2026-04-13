export async function onRequestPost(context) {
  try {
    // Получаем данные из формы
    const data = await context.request.formData();
    const name = data.get('name');
    const phone = data.get('phone');
    const item = data.get('item'); // если есть поле с названием товара

    // Достаем ключи из настроек Cloudflare
    const token = context.env.TELEGRAM_TOKEN;
    const chatId = context.env.TELEGRAM_CHAT_ID;

    // Формируем текст сообщения
    const text = `🚀 Новый заказ!\n\nИмя: ${name}\nТелефон: ${phone}\nТовар: ${item}`;

    // Отправляем в Telegram
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });

    // После отправки перенаправляем пользователя на страницу "Спасибо" или обратно
    return Response.redirect(context.request.headers.get('origin') + '/thanks.html', 303);

  } catch (err) {
    return new Response('Ошибка при отправке: ' + err.message, { status: 500 });
  }
}
