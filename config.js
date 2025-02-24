const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "m3523J4R#hFweCit7r0ggx_G2LTCvPYiRYmZSxEGL8UgGeHSIC2U",
  OWNER_NUM: process.env.OWNER_NUM || "94781805191",
  PREFIX:process.env.PREFIX || ".",
  ALIVE_IMG:process.env.ALIVE_IMG||"https://raw.githubusercontent.com/Benaliyashodhara/Kaveeshara-/refs/heads/main/777547.jpg?token=GHSAT0AAAAAAC7BCFEOPAQTRHNCBGA4OQCOZ54SOWA",
  ALIVE_MSG:process.env.ALIVE_MSG || "Hello , I am alive now!!\n\n Join my Support group using this Link 📥 \n\n https://chat.whatsapp.com/EXPFUXpHxFR5ur03emaNx0 \n\n 💝 𝐌𝐚𝐝𝐞 𝐛𝐲 KAVEESHARA 💝 \n\n 🔒 𐌒𐌵𐌄𐌄𐌍 𐌁𐌄𐌍𐌀𐌋𐌉 𐋄𐌃 𐌕𐌄𐌀𐌌  🔒 ",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
  MODE:process.env.MODE || "public",
  AUTO_VOICE:process.env.AUTO_VOICE|| "true",
  AUTO_STICKER:process.env.AUTO_STICKER|| "true",
  AUTO_REPLY:process.env.AUTO_REPLY|| "true",
  GEMINI_API_KEY:process.env.GEMINI_API_KEY || "AIzaSyDrhALyWLk7RN40C1sX5a03XVk8tO48P_8",
  MOVIE_API_KEY:process.env.MOVIE_API_KEY || "sky|d154108e41377cceb22ef92434509bc9081ae46b",
  
};
