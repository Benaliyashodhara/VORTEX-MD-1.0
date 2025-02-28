const {cmd , commands} = require('../command')
const config = require('../config');

cmd({
    pattern: "alive",
    react: "👋",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async(robin, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
await robin.sendPresenceUpdate('recording', from);
await robin.sendMessage(from, { audio: { url: "https://github.com/Benaliyashodhara/Kaveeshara-/raw/refs/heads/main/Record-2025-02-21-22-41-27.mp3" }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });

return await robin.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: config.ALIVE_MSG},{quoted: mek})
    
}catch(e){
console.log(e)
reply(`${e}`)
}
})

