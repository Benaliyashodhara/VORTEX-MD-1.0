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


╔═════════===═══════╗  
     💕Queen Benali XD💕
╚═════════===═══════╝  

🎯 *MAIN COMMANDS*  
  ✅ .alive  
  ✅ .menu  
  ✅.ai <text>  
  ✅ .system  
  ✅ .owner  

📥 *DOWNLOAD COMMANDS*  
  ✅ .song <text>  
  ✅.video <text>  
  ✅ .fb <link>  

👥 *GROUP COMMANDS*  
  ${menu.group}  

🔒 *OWNER COMMANDS*  
  ✅ .restart  
  ✅ .update  

✏️ *CONVERT COMMANDS*  
  ✅ .sticker <reply img>  
  ✅ .img <reply sticker>  
  ✅.tr <lang> <text>  
  ♠️.tts <text>  

🔍 *SEARCH COMMANDS*  
  ${menu.search}  

💕 *𝐌𝐚𝐝𝐞 𝐛𝐲 Kaveeshara Uddeepa *  💕 
> 𝔔𝔲𝔢𝔢𝔫 𝔅𝔢𝔫𝔞𝔩𝔦 𝔛𝔇
`;
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fc4.wallpaperflare.com%2Fwallpaper%2F768%2F247%2F699%2Fanime-girls-re-zero-kara-hajimeru-isekai-seikatsu-rem-re-zero-wallpaper-preview.jpg&tbnid=-H9AmNTrW-o25M&vet=1&imgrefurl=https%3A%2F%2Fwww.wallpaperflare.com%2Fsearch%3Fwallpaper%3DREM&docid=FSXVLmgQEIC5mM&w=728&h=410&source=sh%2Fx%2Fim%2Fm1%2F2&kgs=8ed599f858019cdd",
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
