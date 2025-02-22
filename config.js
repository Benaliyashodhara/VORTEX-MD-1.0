const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "rzgjkIhL#tzY0Nv24j6v7V80MttRp29Fznm1HJkxX6N1zgP-5ST4",
  OWNER_NUM: process.env.OWNER_NUM || "94781805191",
  PREFIX:process.env.PREFIX || ".",
  ALIVE_IMG:process.env.ALIVE_IMG||"https://github.com/Benaliyashodhara/Kaveeshara-/blob/main/728203.jpg",
  ALIVE_MSG:process.env.ALIVE_MSG || "Hello , I am alive now!!\n\n Join my Support group using this Link 📥 \n\n https://chat.whatsapp.com/EXPFUXpHxFR5ur03emaNx0 \n\n 💝 𝐌𝐚𝐝𝐞 𝐛𝐲 PANSILU 💝 \n\n 🔒 ᐯㄖ尺ㄒ乇乂 爪ᗪ ㄒ乇卂爪 🔒 ",
  AUTO_READ_STATUS:process.env.AUTO_READ_STATUS|| "true",
  MODE:process.env.MODE || "public",
  AUTO_VOICE:process.env.AUTO_VOICE|| "true",
  AUTO_STICKER:process.env.AUTO_STICKER|| "true",
  AUTO_REPLY:process.env.AUTO_REPLY|| "true",
  
};
