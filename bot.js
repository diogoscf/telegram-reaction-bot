process.env.NTBA_FIX_319 = 1;
require("dotenv").config();

const fs = require("fs");
const https = require("https");

if (process.env.OCR !== "ENABLED" && process.env.OCR !== "DISABLED") {
  throw `Please specify a valid value for OCR status. ${process.env.OCR} is not a valid value.`
}

const OCR_ENABLED = process.env.OCR === "ENABLED"

const tesseract = require("node-tesseract-ocr");
const tesseract_config = {
  lang: "eng",
  oem: 1,
  psm: 3
};

const TelegramBot = require("node-telegram-bot-api");
const TELEGRAM_TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TELEGRAM_TOKEN, {
  polling: true
});

const reactions = JSON.parse(fs.readFileSync("reactions.json"));

function randString(len) {
  return [...Array(len)].map(i => (~~(Math.random() * 36)).toString(36)).join("");
}

function checkText(reply_to, txt, img = false) {
  reactions.forEach((data) => {
    data.msgOptions.some((option) => {
      const regex = new RegExp(option.msg, option.modifier);

      if ((!img || option.ocr === "enabled") && txt.match(regex)) {
        const random = data.response[Math.floor(Math.random() * data.response.length)];

        bot.sendMessage(reply_to.chat.id, random, {
          reply_to_message_id: reply_to.message_id
        });

        return true;
      }

      return false;
    });
  });
};

bot.on("message", (msg) => {
  const text = msg.text || msg.caption;
  if (text !== undefined) {
    checkText(msg, text);
    return;
  }

  if (OCR_ENABLED && msg.photo !== undefined) {
    // Random file name, to limit the risks of file collision. Telegram always provides .jpg photos
    file = fs.createWriteStream(randString(21) + ".jpg")

    bot.getFileLink(msg.photo[msg.photo.length - 1].file_id).then((link) => {
      https.get(link, (resp) => {
        resp.pipe(file)
      })
      tesseract.recognize(file.path)
        .then((text) => {
          checkText(msg, text, true)
          fs.unlink(file.path, (err) => {
            if (err) console.error(err);
          })
        })
        .catch((err) => console.error(err));
    });
  }

});
