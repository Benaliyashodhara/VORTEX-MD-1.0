const { cmd, commands } = require("../command");
const config = require('../config');

cmd(
  {
    pattern: "menu",
    alise: ["getmenu"],
    react: "📋",
    desc: "get cmd list",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      let menu = {
        main: "",
        download: "",
        group: "",
        owner: "",
        convert: "",
        search: "",
      };

      for (let i = 0; i < commands.length; i++) {
        if (commands[i].pattern && !commands[i].dontAddCommandList) {
          menu[
            commands[i].category
          ] += `${config.PREFIX}${commands[i].pattern}\n`;
        }
      }

      let madeMenu = `👋 *Hello  ${pushname}*
╔════◇◆◇════╗
✨ Queen Benali XD ✨
╚════◇◆◇════╝

❄️ Embrace the Zero, Rewrite the Fate ❄️

📜 COMMANDS DIRECTORY
🚀 .alive - Check bot status
📜 .menu - View command list
🤖 .ai <text> - Chat with AI
⚙️ .system - Get system info
👑 .owner - Show bot owner

🎵 MEDIA COMMANDS
🎶 .song <text> - Download song
📽 .video <text> - Get video
📱 .fb <link> - Download Facebook video
🔗 .upload <animepahe link> - Upload anime
📝 .sinhala <text> - Sinhala translation
📂 .dl <d.link> - Direct link downloader
🎭 .rtik <text> - TikTok downloader

🛡 GROUP CONTROL
🔇 .mute - Silence chat
👢 .kick - Remove user

🔒 OWNER EXCLUSIVES
🔄 .restart - Restart bot

🖌 UTILITY COMMANDS
🎨 .sticker <reply img> - Convert to sticker
📸 .img <reply sticker> - Sticker to image
🌍 .tr <lang> <text> - Translate text
🗣 .tts <text> - Text to speech
🖊 .gen <text> - Generate text-based image
🎭 .gen2 <text> - Advanced text-to-image

🔎 SEARCH COMMANDS
🔍 .anime <text> - Find anime info
📰 .hirunews - Get Hiru news
🌦 .weather <text> - Weather updates
🖼 .img <text> - Image search
📰 .itnnews <text> - ITN news

╔═══════◇◆◇═══════╗
"Even if fate is rewritten, the struggle remains."
~ Inspired by Re:Zero
> Created by Kaveeshara
╚═══════◇◆◇═══════╝
`;
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/IMG-20250228-WA0014.jpg",
          },
          caption: madeMenu,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
