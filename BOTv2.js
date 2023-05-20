require('dotenv').config({path: '/home/ubuntu/BOT/.env'});
const { Configuration, OpenAIApi } = require("openai");
const incrementCommand = require('./commands/eggroll');
const axios = require('axios')
const { exec } = require('child_process');
const fs = require("fs");
const os = require("os");
let channelData = [];
try {
  const jsonData = fs.readFileSync('/home/ubuntu/BOT/channels.json', 'utf8');
  channelData = JSON.parse(jsonData);
} catch (err) {
  console.error('Error reading JSON file:', err);
}

const path = require('path');

console.log(channelData);

const tmi = require("tmi.js");

const prefix = "'";

const client = new tmi.Client({
    options: {
      joinInterval: 300,
      debug: true,
      messagesLogLevel: "info",
    },
    connection: {
      reconnect: true,
      secure: true,
    },
    identity: {
      username: process.env.username,
      password: process.env.password,
    },
    channels: channelData,
  });


const runTime = new Date().toString();
console.log(`runTime: ${runTime}`);
module.exports = {
    runTime,
    client
}

const cooldowns = new Map();

module.exports = {
    checkCooldown(user, commandName, cooldownTime) {
        const cooldownKey = `${user}:${commandName}`; 
        const lastCommandTime = cooldowns.get(cooldownKey);

        if (lastCommandTime && (Date.now() - lastCommandTime) < cooldownTime) {
            const remainingCooldown = (lastCommandTime + cooldownTime - Date.now()) / 1000;
            return remainingCooldown;
        }

        cooldowns.set(cooldownKey, Date.now());
        return null;
    }
};


const commandFiles = fs.readdirSync(path.join(__dirname, 'commands'))
    .filter(file => file.endsWith('.js'));

const commands = new Map();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

client.connect();

client.on('message', async (channel, userstate, message, self) => {
    if (self) return;




    if (channel == "#pajlada") {
        if (
          message == "ApuApustaja 👉 🚨 ALERTA" &&
          userstate["user-id"] == "683214289"
        ) {
          client.action(channel, "PAJAS 🚨 POPLACH");
        }
      }


      if (channel === "#felyp8") {
        if (message === "test") {
          fs.readFile(
            "/home/ubuntu/BOT/counter.txt",
            "utf8",
            function (err, data) {
              if (err) {
                console.log("Error reading file:", err);
              } else {
                console.log("Current count:", parseInt(data));
                let count = data;
  
                client.action(
                  channel,
                  `Test number ${count} successful LaterGator `
                );
  
                count++;
                fs.writeFile(
                  "/home/ubuntu/BOT/counter.txt",
                  count,
                  function (err) {
                    if (err) {
                      console.log("Error writing file:", err);
                    } else {
                      console.log("Count updated to:", count);
                    }
                  }
                );
              }
            }
          );
        }
      }

    if (!message.startsWith(prefix)) return;


async function isStreamLive(channel) {
    try {
      const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
        headers: {
          'Client-ID': process.env.NEW_client_id, 
          'Authorization': `Bearer ${process.env.NEW_access_token}` 
        }
      });
  
      return response.data.data.length > 0;
    } catch (error) {
      console.error('Error checking stream status:', error);
      return false;
    }
  }
  const isChannelLive = await isStreamLive('minusinsanity');
  if (channel === "#minusinsanity" && isChannelLive) {
    console.log("Couldn't send a message (Channel is live)")
    ;return;
  }




    let isMod = userstate.mod || userstate["user-type"] === "mod";
    let isBroadcaster = channel.slice(1) === userstate.username;
    let isModUp = isMod || isBroadcaster;
  module.exports = {
       isBroadcaster,
       isModUp
  }

    const args = message
    .replace("\u{E0000}", "")
    .trim()
    .slice(1)
    .split(" ")
    .filter((element) => element);
    const commandName = args.shift().toLowerCase();


    if (!commands.has(commandName)) return;

    const command = commands.get(commandName);

    try {
        command.execute(client, channel, userstate, args, message);
    } catch (error) {
        console.error(error);
        client.say(channel, 'An error occurred while executing the command.');
    }


});