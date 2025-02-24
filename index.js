const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers,
} = require("@whiskeysockets/baileys");

const l = console.log;
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,
} = require("./lib/functions");
const fs = require("fs");
const P = require("pino");
const config = require("./config");
const qrcode = require("qrcode-terminal");
const util = require("util");
const { sms, downloadMediaMessage } = require("./lib/msg");
const axios = require("axios");
const { File } = require("megajs");
const prefix = config.PREFIX || "!";
const ownerNumber = config.OWNER_NUM || "default_owner_number";

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
  if (!config.SESSION_ID) {
    console.log("Please add your session to SESSION_ID in the config!");
    process.exit(1);  // Exit the process with an error code
  }
  
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  
  filer.download((err, data) => {
    if (err) {
      console.error("Failed to download session:", err);
      return;
    }
    fs.writeFile(__dirname + "/auth_info_baileys/creds.json", data, () => {
      console.log("Session downloaded ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
  try {
    console.log("Connecting Benali XD ");
    const { state, saveCreds } = await useMultiFileAuthState(
      __dirname + "/auth_info_baileys/"
    );
    const { version } = await fetchLatestBaileysVersion();

    const robin = makeWASocket({
      logger: P({ level: "silent" }),
      printQRInTerminal: false,
      browser: Browsers.macOS("Firefox"),
      syncFullHistory: true,
      auth: state,
      version,
    });

    robin.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        if (
          lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        ) {
          console.log("Reconnecting in 5 seconds...");
          setTimeout(connectToWA, 5000);  // Retry after 5 seconds
        }
      } else if (connection === "open") {
        console.log("Benali XD connected to WhatsApp ✅");
        const path = require("path");
        fs.readdirSync("./plugins/").forEach((plugin) => {
          if (path.extname(plugin).toLowerCase() === ".js") {
            try {
              require("./plugins/" + plugin);
            } catch (error) {
              console.error("Error loading plugin:", error);
            }
          }
        });
        console.log("Benali XD installed successfully ✅");

        let up = `Benali XD connected successfully ✅`;
        robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
          image: {
            url: `https://raw.githubusercontent.com/Benaliyashodhara/Kaveeshara-/refs/heads/main/777547.jpg?token=GHSAT0AAAAAAC7BCFEOPAQTRHNCBGA4OQCOZ54SOWA`,
          },
          caption: up,
        });
      }
    });

    robin.ev.on("creds.update", saveCreds);

    robin.ev.on("messages.upsert", async (mek) => {
      mek = mek.messages[0];
      if (!mek.message) return;
      mek.message =
        getContentType(mek.message) === "ephemeralMessage"
          ? mek.message.ephemeralMessage.message
          : mek.message;
      
      if (
        mek.key &&
        mek.key.remoteJid === "status@broadcast" && 
        config.AUTO_READ_STATUS === "true"
      ) {
        await robin.readMessage([mek.key]);
      }
      
      const m = sms(robin, mek);
      const type = getContentType(mek.message);
      const content = JSON.stringify(mek.message);
      const from = mek.key.remoteJid;
      const quoted =
        type == "extendedTextMessage" &&
        mek.message.extendedTextMessage.contextInfo != null
          ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
          : [];
      const body =
        type === "conversation"
          ? mek.message.conversation
          : type === "extendedTextMessage"
          ? mek.message.extendedTextMessage.text
          : type == "imageMessage" && mek.message.imageMessage.caption
          ? mek.message.imageMessage.caption
          : type == "videoMessage" && mek.message.videoMessage.caption
          ? mek.message.videoMessage.caption
          : "";
      const isCmd = body.startsWith(prefix);
      const command = isCmd
        ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
        : "";
      const args = body.trim().split(/ +/).slice(1);
      const q = args.join(" ");
      const isGroup = from.endsWith("@g.us");
      const sender = mek.key.fromMe
        ? robin.user.id.split(":")[0] + "@s.whatsapp.net" || robin.user.id
        : mek.key.participant || mek.key.remoteJid;
      const senderNumber = sender.split("@")[0];
      const botNumber = robin.user.id.split(":")[0];
      const pushname = mek.pushName || "Sin Nombre";
      const isMe = botNumber.includes(senderNumber);
      const isOwner = ownerNumber.includes(senderNumber) || isMe;
      const botNumber2 = await jidNormalizedUser(robin.user.id);
      const groupMetadata = isGroup
        ? await robin.groupMetadata(from).catch((e) => {})
        : "";
      const groupName = isGroup ? groupMetadata.subject : "";
      const participants = isGroup ? await groupMetadata.participants : "";
      const groupAdmins = isGroup ? await getGroupAdmins(participants) : "";
      const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
      const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
      const isReact = m.message.reactionMessage ? true : false;
      const reply = (teks) => {
        robin.sendMessage(from, { text: teks }, { quoted: mek });
      };

      // owner react
      if (senderNumber.includes("94781805191")) {
        if (isReact) return;
        m.react("💕");
      }

      // work type
      if (!isOwner && config.MODE === "private") return;
      if (!isOwner && isGroup && config.MODE === "inbox") return;
      if (!isOwner && !isGroup && config.MODE === "groups") return;

      const events = require("./command");
      const cmdName = isCmd
        ? body.slice(1).trim().split(" ")[0].toLowerCase()
        : false;

      if (isCmd) {
        const cmd =
          events.commands.find((cmd) => cmd.pattern === cmdName) ||
          events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
        if (cmd) {
          if (cmd.react)
            robin.sendMessage(from, { react: { text: cmd.react, key: mek.key } });

          try {
            cmd.function(robin, mek, m, {
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
            });
          } catch (e) {
            console.error("[PLUGIN ERROR] " + e);
          }
        }
      }

      events.commands.map(async (command) => {
        if (body && command.on === "body") {
          command.function(robin, mek, m, {
            from,
            l,
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
          });
        } else if (mek.q && command.on === "text") {
          command.function(robin, mek, m, {
            from,
            l,
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
          });
        } else if (
          (command.on === "image" || command.on === "photo") &&
          mek.type === "imageMessage"
        ) {
          command.function(robin, mek, m, {
            from,
            l,
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
          });
        } else if (command.on === "sticker" && mek.type === "stickerMessage") {
          command.function(robin, mek, m, {
            from,
            l,
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
          });
        }
      });
      //============================================================================
    });
  } catch (error) {
    console.error("Error during WA connection:", error);
    setTimeout(connectToWA, 5000);  // Retry after 5 seconds
  }
}

app.get("/", (req, res) => {
  res.send("hey, Queen Benali XD started✅");
});

app.listen(port, () =>
  console.log(`Server listening on port http://localhost:${port}`)
);

setTimeout(() => {
  connectToWA();
}, 4000);
