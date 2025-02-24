const { cmd, commands } = require("../command");
const config = require('../config');

cmd(
  {
    pattern: "menu",
    alias: ["getmenu"], // Fixed 'alise' to 'alias'
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
      // Build the menu dynamically based on the commands array
      let menu = {
        main: "",
        download: "",
        group: "",
        owner: "",
        convert: "",
        search: "",
      };

      // Loop through commands to populate the menu categories
      for (let i = 0; i < commands.length; i++) {
        if (commands[i].pattern && !commands[i].dontAddCommandList) {
          menu[commands[i].category] += `${config.PREFIX}${commands[i].pattern}\n`;
        }
      }

      // Construct the message with dynamic menu content
      let madeMenu = `👋 *Hello ${pushname}*

╔════════════════╗  
     💕  QUEEN BENALI XD 💕
╚════════════════╝  

🎯 *MAIN COMMANDS*  
  ✅ .alive  
  ✅ .menu  
  ✅ .ai <text>  
  ✅ .system  
  ✅ .owner  

📥 *DOWNLOAD COMMANDS*  
  ✅ .song <text>  
  ✅ .video <text>  
  ✅ .fb <link>  
  ✅ .upload <animepahe d.link>
  ✅ .sinhala <text>
  ✅ .dl <d.link>

👥 *GROUP COMMANDS*  
  ✅ .mute
  ✅ .kick

🔒 *OWNER COMMANDS*  
  👉✅ .restart    

✏️ *CONVERT COMMANDS*  
  ✅ .sticker <reply img>  
  ✅ .img <reply sticker>  
  ✅ .tr <lang> <text>  
  ✅ .tts <text>  

🔍 *SEARCH COMMANDS*  
  ✅ .anime <text>
  ✅ .hirunews

Made by Kaveeshara Uddeepa  
> 💕 Qᵤₑₑₙ Bₑₙₐₗᵢ ₓD 💕
`;

      // Send the message with an image and the menu
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/Benaliyashodhara/Kaveeshara-/refs/heads/main/728203.jpg?token=GHSAT0AAAAAAC7BCFEPEETYBUEA6QFBTMY2Z54SHCA", // Corrected the image URL
          },
          caption: madeMenu,
        },
        { quoted: mek } // Ensure the original message is quoted
      );
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
      
