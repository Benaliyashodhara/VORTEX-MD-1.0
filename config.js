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
  ALIVE_IMG:process.env.ALIVE_IMG||"https://raw.githubusercontent.com/Benaliyashodhara/Kaveeshara-/refs/heads/main/738559.jpg?token=GHSAT0AAAAAAC7BCFEPEJOULXZ7NP2NWMKEZ6BOJWA",
  ALIVE_MSG:process.env.ALIVE_MSG || "Hello , I am alive now!!\n\n Join my Support group using this Link 📥 \n\n https://chat.whatsapp.com/EXPFUXpHxFR5ur03emaNx0 \n\n 💝 𝐌𝐚𝐝𝐞 𝐛𝐲 Kaveeshara 💝 \n\n 🔒 Q҈U҈E҈E҈N҈ B҈E҈N҈A҈L҈I҈ X҈D҈ 🔒 ",
  MODE:process.env.MODE || "public",
  AUTO_VOICE:process.env.AUTO_VOICE|| "true",
  AUTO_STICKER:process.env.AUTO_STICKER|| "true",
  AUTO_REPLY:process.env.AUTO_REPLY|| "true",
  GEMINI_API_KEY:process.env.GEMINI_API_KEY || "AIzaSyChi4GvBSne3ioNVXGnwMomImVJ2Vb7z80",
  MOVIE_API_KEY:process.env.MOVIE_API_KEY || "sky|0933c845af0e122be186adda178a669317e00660",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
};
