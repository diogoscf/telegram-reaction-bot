process.env.NTBA_FIX_319 = 1;
require("dotenv").config();

const fs = require("fs");

const TelegramBot = require("node-telegram-bot-api");
const TELEGRAM_TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TELEGRAM_TOKEN, {
  polling: true
});

const reactions = JSON.parse(fs.readFileSync("reactions.json"));

bot.on("message", (msg) => {
  const text = msg.text || msg.caption;
  if (text === undefined) {
    return;
  }

  reactions.forEach((data) => {
    data.msgOptions.some((option) => {
      const regex = new RegExp(option.msg, option.modifier);
      if (text.match(regex)) {
        const random = data.response[Math.floor(Math.random() * data.response.length)];
        bot.sendMessage(msg.chat.id, random, {
          reply_to_message_id: msg.message_id
        });
        return true;
      }
      return false;
    });
  });
});
