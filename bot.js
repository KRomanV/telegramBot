/* eslint-disable max-len */
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const productModel = require('./db/models/product');
const connectToDB = require('./db/connect');
const parsingDb = require('./parsingdb');

const token = process.env.BOT_TOKEN;
connectToDB();

const bot = new TelegramBot(token, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10,
    },
  },
});

function debug(obj = {}) {
  return JSON.stringify(obj, null, 4);
}

// bot.on('message', (msg) => {
//   const { id } = msg.chat;
//   if (msg.text.toLowerCase() === 'привет') {
//     bot.sendMessage(id, `Привет, ${msg.from.first_name}`);
//   } else bot.sendMessage(id, debug(msg));
// });

// ==========================================================

// /help / start обработка команд
bot.onText(/\/start/, (msg) => {
  const { id } = msg.chat;
  bot.sendMessage(id, `Привет, ${msg.from.first_name}, введите /help чтобы увидеть что я умею!`);
});

// ==========================================================

// /help / start обработка команд + сообщение вывод сообщения
bot.onText(/\/help/, (msg) => {
  const { id } = msg.chat;
  bot.sendMessage(id, `
/help - вывод доступных команд и функций
/menu - вывод меню с функциями бота
  `);
});

bot.onText(/\/pic/, (msg) => {
  bot.sendPhoto(msg.chat.id, './img/Darkside.jpg', {
    caption: 'picture',
  });
});

bot.onText(/\/menu/, (msg) => {
  const { id } = msg.chat;

  bot.sendMessage(id, 'С помощью местоположения я могу проложить маршрут до магазина. Нажимая на "Отправить контакт" вы регистрируетесь в нашей системе и отправите нам свой номер телефона', {
    reply_markup: {
      keyboard: [
        [{
          text: '🗺Отправить местоположение 🗺',
          request_location: true, // получение локации пользователя
        },
        {
          text: '📳Отправить контакт📳',
          request_contact: true, // получение телефона пользователя
        }],
        ['🤙Полезные ссылочки 👀', '🛑Закрыть Клавиатуру🛑', '😎телефон для связи😎'],
        ['💸МАГАЗИН💸', '🚕Ближайший магазин🚕'],
      ],
      one_time_keyboard: true, // нажатие на любой клавиши клава уходит
    },
  });
});

bot.on('message', async (msg) => {
  const { id } = msg.chat;
  if (msg.text === '💸МАГАЗИН💸') {
    bot.sendMessage(id, 'ВЫБЕРИ БРЕНД', {
      reply_markup: {
        keyboard: [
          ['🌑Darkside🌑', '🥇НАШ🥇', '👼SmokeAngels👼'],
          ['🔙НАЗАД🔙'],
        ],
        one_time_keyboard: true, // нажатие на любой клавиши клава уходит
      },
    });
  }
  if (msg.text === '🌑Darkside🌑' || msg.text === '🥇НАШ🥇' || msg.text === '👼SmokeAngels👼') {
    const brand = msg.text.match(/[а-яА-Я]{1,}|[a-zA-Z]{1,}/g).toString();
    const findAll = await parsingDb(brand);
    bot.sendPhoto(msg.chat.id, `./img/${brand}.jpg`, {
      caption: `${findAll}`,
    });
    //     bot.sendMessage(id, `Наши товары:
    // ----------------------------
    // Табачные смеси:
    // ----------------------------
    // ${findAll}`);
  }
  if (msg.text === '🔙НАЗАД🔙') {
    bot.sendMessage(id, 'С помощью местоположения я могу проложить маршрут до магазина. Нажимая на "Отправить контакт" вы регистрируетесь в нашей системе и отправите нам свой номер телефона', {
      reply_markup: {
        keyboard: [
          [{
            text: '🗺Отправить местоположение 🗺',
            request_location: true, // получение локации пользователя
          },
          {
            text: '📳Отправить контакт📳',
            request_contact: true, // получение телефона пользователя
          }],
          ['🤙Полезные ссылочки 👀', '🛑Закрыть Клавиатуру🛑', '😎телефон для связи😎'],
          ['💸МАГАЗИН💸', '🚕Ближайший магазин🚕'],
        ],
        one_time_keyboard: true, // нажатие на любой клавиши клава уходит
      },
    });
  }
  if (msg.text === '😎телефон для связи😎') {
    bot.sendContact(id, '+8 (910) 541-71-70', 'Malina');
  }
  if (msg.text === '🚕Ближайший магазин🚕') {
    bot.sendVenue(id, 55.12155606960342, 36.61076749999998, 'Hookahteka', 'Лучший магазин кальянных принадлежностей 😎');
  }
  if (msg.text === 'Закрыть Клавиатуру') {
    bot.sendMessage(id, 'Закрываю клавиатуру', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  } else if (msg.text === '🤙Полезные ссылочки 👀') {
    bot.sendMessage(id, '👇👇👇👇👇', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Instagram MalinaBar',
              url: 'https://www.instagram.com/malinabarobninsk/', // при нажатии на кнопку калбек кьвери получит данную дату
            },
            {
              text: 'Instagram Hookahteka',
              url: 'https://www.instagram.com/hookahteka_obn/', // запрашивает переход по ссылке
            },
          ],
          [
            {
              text: 'Бронь стола',
              url: 'https://www.instagram.com/direct/t/340282366841710300949128165014853354047',
            },
          ],
        ],
      },
    });
  }
});

// ==========================================================

// bot.on('message', (msg) => {
//   const html = `<strong>Привет, ${msg.from.first_name}</strong>
//   <pre>
//     ${debug(msg)}
//   </pre>`;
//   // bot.sendMessage(msg.chat.id, html)  просто текст НЕ в формтае HTML
//   bot.sendMessage(msg.chat.id, html, { // позволяет парсить HTML в телегу
//     parse_mode: 'HTML',
//   });
// });

// ==========================================================

// bot.on('message', (msg) => {
//   const markdown = `
//   *hello, ${msg.from.first_name}* // Синтаксис Markdown(похож на HTML)
//   _hello, ${msg.from.first_name}_
//   `;

//   bot.sendMessage(msg.chat.id, markdown, {
//     parse_mode: 'Markdown',
//   });
// });

// ==========================================================

// bot.on('message', (msg) => {Replyinsk/', {
//       disable_web_page_preview: false, // отключение превью ссылки
//       disable_notification: false, // отключение уведомления (звука)
//     });
//   }, 2000);
// });

// ==========================================================

// bot.on('message', (msg) => { // клавиатура передается в массиве массивов вторые массивы - строки
//   const { id } = msg.chat;
//   if (msg.text === 'Закрыть') {
//     bot.sendMessage(id, 'закрываю клавиатуру', {
//       reply_markup: {
//         remove_keyboard: true,
//       },
//     });
//   } else if (msg.text === 'Ответить') {
//     bot.sendMessage(id, 'Отвечаю', {
//       reply_markup: {
//         force_reply: true,
//       },
//     });
//   } else {
//     bot.sendMessage(id, 'Клавиатура', {
//       reply_markup: {
//         keyboard: [
//           [{
//             text: 'Отправить местоположение',
//             request_location: true, // получение локации пользователя
//           }],
//           ['Ответить', 'Закрыть'],
//           [{
//             text: 'Отправить контакт',
//             request_contact: true, // получение телефона пользователя
//           }],
//         ],
//         one_time_keyboard:true, // нажатие на любой клавиши клава уходит
//       },
//     });
//   }
// });

// =================================

// bot.on('message', (msg) => { // кнопки от самого бота (НЕ МЕНЮ)
//   const { id } = msg.chat;
//   bot.sendMessage(id, 'Inline keyboard', {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: 'Google',
//             url: 'https://google.com', // запрашивает переход по ссылке
//           },
//         ],
//         [
//           {
//             text: 'Reply',
//             callback_data: 'reply', // при нажатии на кнопку калбек кьвери получит данную дату
//           },
//           {
//             text: 'Forward',
//             callback_data: 'forward', // при нажатии на кнопку калбек кьвери получит данную дату
//           },
//         ],
//       ],
//     },
//   });
// });

// bot.on('callback_query', (query) => {
//   //const { id } = query.message.chat;
//   // bot.sendMessage(id, debug(query));

//   bot.answerCallbackQuery(query.id, `${query.data}`); // callback_data: из ф-ции вышк
// });

// ==============================================================================

bot.on('inline_query', (query) => { // создаем 5 тайтлов с отпарвкой сообщения в других чатах через @имя бота
  const result = [];

  for (let i = 0; i < 5; i += 1) {
    result.push({
      type: 'article',
      id: i.toString(),
      title: `Title${i}`,
      input_message_content: {
        message_text: `Article #${i}`,
      },
    });
  }

  bot.answerInlineQuery(query.id, result, {
    cache_time: 0,
  });
});

// ==============================================================================

// const inline_keyboard = [
//   [
//     {
//       text: 'Forward',
//       callback_data: 'forward',
//     },
//     {
//       text: 'Reply',
//       callback_data: 'reply',
//     },
//   ],
//   [
//     {
//       text: 'Edit',
//       callback_data: 'edit',
//     },
//     {
//       text: 'Delete',
//       callback_data: 'delete',
//     },
//   ],
// ];

// bot.on('callback_query', (query) => {
//   const { chat, message_id, text } = query.message;

//   switch (query.data) {
//     case 'forward':
//       // куда, откуда, message.id(что)
//       bot.forwardMessage(chat.id, chat.id, message_id);
//       break;
//     case 'reply':
//       bot.sendMessage(chat.id, 'Ответ на сообщение', { // ответ на сообщение от юзера по кнопке reply
//         reply_to_message_id: message_id,
//       });
//       break;
//     case 'edit':
//       bot.editMessageText(`${text} (edited)`, {
//         chat_id: chat.id,
//         message_id,
//         reply_markup: { inline_keyboard },
//       });
//       break;
//     case 'delete':
//       bot.deleteMessage(chat.id, message_id);
//       break;
//     default:
//       break;
//   }

//   bot.answerCallbackQuery({
//     callback_query_id: query.id,
//   });
// });
// bot.onText(/\/start/, (msg, [source, match]) => {
//   const chatId = msg.chat.id;

//   bot.sendMessage(chatId, 'Keyboard', {
//     reply_markup: {
//       inline_keyboard,
//     },
//   });
// });
