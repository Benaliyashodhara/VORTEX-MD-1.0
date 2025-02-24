const { cmd, commands } = require('../command');
const config = require('../config');

cmd({
    pattern: "alive",
    react: "❤️",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Sending a presence update, indicating that the bot is "recording"
        await robin.sendPresenceUpdate('recording', from);

        // Sending audio message
        await robin.sendMessage(from, {
            audio: { 
                url: "https://github.com/Benaliyashodhara/Kaveeshara-/blob/main/Record-2025-02-21-22-41-27.mp3" 
            }, 
            mimetype: 'audio/mpeg', 
            ptt: true
        }, { quoted: mek });

        // Sending the image with alive message
        return await robin.sendMessage(from, {
            image: { url: config.ALIVE_IMG }, 
            caption: config.ALIVE_MSG
        }, { quoted: mek });
        
    } catch (e) {
        // Logging and replying the error if something goes wrong
        console.log(e);
        reply(`${e}`);
    }
});
    
