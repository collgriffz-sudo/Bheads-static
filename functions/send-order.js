export async function onRequestPost(context) {
  try {
    // 1. Читаем данные заказа
    const data = await context.request.json();
    
    // 2. Достаем ключи из настроек Cloudflare
    const token = context.env.TELEGRAM_TOKEN;
    const chatId = context.env.TELEGRAM_CHAT_ID;
    const resendKey = context.env.RESEND_API_KEY;

    if (!token || !chatId) {
        return new Response('Ошибка: Токен или ChatID не настроены в панели Cloudflare', { status: 500 });
    }

    // 3. Формируем заголовок и основное сообщение (универсально для TG и Email)
    const orderNum = data.orderNumber || 'БЕЗ НОМЕРА';
    const emailTarget = 'mrbheads7@gmail.com'; // Почта, на которую регистрировал Resend

    let messageText = `BHeads7.ru 📦 **ЗАКАЗ №${orderNum}**\n`;
    messageText += `──────────────────\n`;

    // 4. Перебираем ВСЕ поля (твой проверенный цикл)
    for (const key in data) {
      if (['cartItems', 'orderNumber'].includes(key)) continue;
      
      const label = key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
      
      let value = data[key];
      if (value === true) value = "✅ Да";
      if (value === false) value = "❌ Нет";
      
      messageText += `**${label}**: ${value}\n`;
    }

    // 5. Добавляем список товаров
    let itemsHtml = ""; // Для письма
    if (data.cartItems && Array.isArray(data.cartItems)) {
      messageText += `──────────────────\n`;
      messageText += `🛒 **ТОВАРЫ:**\n`;
      data.cartItems.forEach(item => {
        const line = `• ${item.name} — ${item.quantity} шт. (${item.price} руб.)`;
        messageText += line + `\n`;
        itemsHtml += `<li>${line}</li>`;
      });
    }

    // 6. Отправка в Telegram
    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const tgResponse = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown'
      })
    });

    // 7. Отправка на Email через Resend
    let emailSent = false;
    if (resendKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'BHeads <onboarding@resend.dev>',
          to: emailTarget,
          subject: `Новый заказ №${orderNum}`,
          // Превращаем Markdown в простой текст с переносами строк для письма
          html: messageText.replace(/\*\*/g, '').replace(/\n/g, '<br>')
        })
      });
      emailSent = emailResponse.ok;
    }

    return new Response(JSON.stringify({ 
        status: "success", 
        tg_sent: tgResponse.ok, 
        email_sent: emailSent 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response('Ошибка сервера: ' + err.message, { status: 500 });
  }
}
