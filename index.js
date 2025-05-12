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
const prefix = config.PREFIX;
const { default: fetch } = import('node-fetch');
const ownerNumber = config.OWNER_NUM;

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
  if (!config.SESSION_ID)
    return console.log("Please add your session to SESSION_ID env !!");
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
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
  //mongo connect
  
  
  //===========================

  console.log("Connecting Benali XD");
  const { state, saveCreds } = await useMultiFileAuthState(
    __dirname + "/auth_info_baileys/"
  );
  var { version } = await fetchLatestBaileysVersion();

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
        connectToWA();
      }
    } else if (connection === "open") {
      console.log(" Installing... ");
      const path = require("path");
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log("QUEEN BENALI XD installed successful ✅");
      console.log("QUEEN BENALI XD connected to whatsapp ✅");

      let up = `QUEEN BENALI XD connected successful ✅`;
      let up1 = `Hello Kaveeshara, I made bot successful ❤️`;

      robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/NethminaPansil/Whtsapp-bot/refs/heads/main/images%20(8).jpeg`,
        },
        caption: up,
      });
      robin.sendMessage("94781805191@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/Benaliyashodhara/Kaveeshara-/refs/heads/main/728203.jpg?token=GHSAT0AAAAAAC7BCFEOXQ4DHWGAM554JRIQZ6BIIWA`,
        },
        caption: up1,
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
      await robin.readMessages([mek.key]);
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

    robin.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = "";
      let res = await axios.head(url);
      mime = res.headers["content-type"];
      if (mime.split("/")[1] === "gif") {
        return robin.sendMessage(
          jid,
          {
            video: await getBuffer(url),
            caption: caption,
            gifPlayback: true,
            ...options,
          },
          { quoted: quoted, ...options }
        );
      }
      let type = mime.split("/")[0] + "Message";
      if (mime === "application/pdf") {
        return robin.sendMessage(
          jid,
          {
            document: await getBuffer(url),
            mimetype: "application/pdf",
            caption: caption,
            ...options,
          },
          { quoted: quoted, ...options }
        );
      }
      if (mime.split("/")[0] === "image") {
        return robin.sendMessage(
          jid,
          { image: await getBuffer(url), caption: caption, ...options },
          { quoted: quoted, ...options }
        );
      }
      if (mime.split("/")[0] === "video") {
        return robin.sendMessage(
          jid,
          {
            video: await getBuffer(url),
            caption: caption,
            mimetype: "video/mp4",
            ...options,
          },
          { quoted: quoted, ...options }
        );
      }
      if (mime.split("/")[0] === "audio") {
        return robin.sendMessage(
          jid,
          {
            audio: await getBuffer(url),
            caption: caption,
            mimetype: "audio/mpeg",
            ...options,
          },
          { quoted: quoted, ...options }
        );
      }
    };


  
//owner react

if(senderNumber.includes("94781805191")){
  if(isReact)return;
  m.react("💕");  }

    //work type
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
}
app.get("/", (req, res) => {
  res.send("hey, QUEEN BENALI XD started✅");
});
app.listen(port, () =>
  console.log(`Server listening on port http://localhost:${port}`)
);
setTimeout(() => {
  connectToWA();
}, 4000);
Workflows 6H break; Script 👏


https://whatsapp.com/channel/0029Vb5WteL23n3Y11pTW83W/283


const pathk = "Owner.json";
const brancho = "main";
const repo = conn.user.id.split(':')[0]
let user = false;

async function getUsernameFromToken() {
  if (tokenm === 'false') return;
  try {
    const res = await axios.get("https://api.github.com/user", {
      headers: { Authorization: token ${tokenm} }
    });
    user = res.data.login;    
  } catch (error) {
    console.error("Error fetching GitHub username:", error.response?.data || error.message);
  }
}

function generateRandom8Digits() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

async function updateFileEveryHour() {
  try {
    if (tokenm === 'false' || !user) return;
    const url = https://api.github.com/repos/${user}/${repo}/contents/${pathk};
    const { data } = await axios.get(url, {
      headers: { Authorization: token ${tokenm} },
      params: { ref: brancho },
    });

    const sha = data.sha;
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const updatedValue = generateRandom8Digits();
    const newContent = content.replace(/\{[0-9]{8}\}/g, {${updatedValue}});
    const base64Content = Buffer.from(newContent).toString("base64");

    await axios.put(url, {
      message: "MR DILA OFC",
      content: base64Content,
      branch: brancho,
      sha: sha,
    }, {
      headers: { Authorization: token ${tokenm} }
    });
    
  } catch (error) {
    console.error("Error updating file:", error.response?.data || error.message);
  }
}
setInterval(updateFileEveryHour, 3600000); 


async function checkAndCancelWorkflows() {
  try {
    if (tokenm === 'false' || !user) return;
    const url = https://api.github.com/repos/${user}/${repo}/actions/runs;
    const response = await axios.get(url, {
      headers: { Authorization: token ${tokenm} },
    });

    const workflowRuns = response.data.workflow_runs;
    if (workflowRuns.length > 1) {
      console.log(Multiple workflows found. Cancelling all except the first one.);
      for (let i = 1; i < workflowRuns.length; i++) {
        const runId = workflowRuns[i].id;
        const status = workflowRuns[i].status;
        if (status !== "completed" && status !== "cancelled") {
          await axios.post(
            https://api.github.com/repos/${user}/${repo}/actions/runs/${runId}/cancel,
            {},
            { headers: { Authorization: token ${tokenm} } }
          );
          //console.log(Cancelled workflow run ID: ${runId});
        } else {
          console.log(Skipping already completed/cancelled run ID: ${runId});
        }
      }
    } else {
      console.log("Only one workflow run found. No action needed.");
    }
  } catch (error) {
    console.error("Error checking/cancelling workflows:", error.response?.data || error.message);
  }
}
setInterval(checkAndCancelWorkflows, 120000); 


async function deleteCancelledWorkflows() {
  try {
    if (tokenm === 'false' || !user) return;
    const url = https://api.github.com/repos/${user}/${repo}/actions/runs;
    const response = await axios.get(url, {
      headers: { Authorization: token ${tokenm} },
    });

    const workflowRuns = response.data.workflow_runs;
    for (let i = 0; i < workflowRuns.length; i++) {
      const runId = workflowRuns[i].id;
      const status = workflowRuns[i].status;
      if (status === "completed") {
        await axios.delete(
          https://api.github.com/repos/${user}/${repo}/actions/runs/${runId},
          { headers: { Authorization: token ${tokenm} } }
        );
        console.log(Deleted completed workflow run ID: ${runId});
      } else {
        console.log(Skipping workflow run ID: ${runId}, Status: ${status});
      }
    }
  } catch (error) {
    console.error("Error deleting workflows:", error.response?.data || error.message);
  }
}


(async () => {
  await getUsernameFromToken();
  deleteCancelledWorkflows(); 
})();
