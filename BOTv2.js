require("dotenv").config({ path: "/home/ubuntu/BOT/.env" });
const axios = require("axios");
const humanizeDuration = require("humanize-duration");
const got = require("got");
const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

let channelData = [];
try {
  const jsonData = fs.readFileSync("/home/ubuntu/BOT/channels.json", "utf8");
  channelData = JSON.parse(jsonData);
} catch (err) {
  console.error("Error reading JSON file:", err);
}
let offlineOnly = [];
let commandsArray = [];

console.log(channelData);

const tmi = require("tmi.js");
const { isModuleNamespaceObject } = require("util/types");

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

let reminderData = [];
try {
  const jsonData = fs.readFileSync(
    "/home/ubuntu/BOT/reminderslist.json",
    "utf8"
  );
  reminderData = JSON.parse(jsonData);
} catch (err) {
  console.error("Error reading Reminder JSON file:", err);
}

let afkStatusData = [];
try {
  const jsonData = fs.readFileSync("/home/ubuntu/BOT/afkstatus.json", "utf8");
  afkStatusData = JSON.parse(jsonData);
} catch (err) {
  console.error("Error reading AFK status JSON file:", err);
}

let gnStatusData = [];
try {
  const jsonData = fs.readFileSync("/home/ubuntu/BOT/gnstatus.json", "utf8");
  gnStatusData = JSON.parse(jsonData);
} catch (err) {
  console.error("Error reading GN status JSON file:", err);
}

client.remind = new Map(reminderData);
const remind = client.remind;
client.gn = new Map(gnStatusData);
const gn = client.gn;
client.afk = new Map(afkStatusData);
const afk = client.afk;
module.exports = {
  afk,
  gn,
};

const runTime = new Date().toString();
console.log(`runTime: ${runTime}`);
module.exports = {
  remind,
  runTime,
  client,
};

const cooldowns = new Map();

function checkCooldown(user, commandName, cooldownTime) {
  const cooldownKey = `${user}:${commandName}`;
  const lastCommandTime = cooldowns.get(cooldownKey);

  if (lastCommandTime && Date.now() - lastCommandTime < cooldownTime) {
    const remainingCooldown =
      (lastCommandTime + cooldownTime - Date.now()) / 1000;
    return remainingCooldown;
  }

  cooldowns.set(cooldownKey, Date.now());
  return null;
}

module.exports = checkCooldown;

const customCommandsFilePath = path.join(__dirname, "commandData.json");

const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

const commands = new Map();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

client.connect();

client.on("message", async (channel, userstate, message, self) => {
  if (self) return;

  let isMod = userstate.mod || userstate["user-type"] === "mod";
  let isBroadcaster = channel.slice(1) === userstate.username;
  let isModUp = isMod || isBroadcaster;
  module.exports = {
    isBroadcaster,
    isModUp,
  };

  fs.readFile(
    "/home/ubuntu/BOT/reminderslist.json",
    "utf8",
    async (err, jsonData) => {
      if (err) {
        console.error("Error reading JSON file:", err);
        return;
      }
      client.remind = new Map(JSON.parse(jsonData));

      let remindcheck = client.remind.get(userstate["username"].toLowerCase());

      if (remindcheck && !(remindcheck.length > 1)) {
        client.remind.delete(userstate["username"].toLowerCase());
        client.action(
          channel,
          `@${userstate["username"]}, reminder from: ${
            remindcheck[0].sender
          } - ${remindcheck[0].message} (${humanizeDuration(
            new Date().getTime() - Date.parse(remindcheck[0].time),
            {
              round: true,
            }
          )} ago)`
        );
        fs.writeFile(
          "/home/ubuntu/BOT/reminderslist.json",
          JSON.stringify(Array.from(client.remind)),
          (err) => {
            if (err) {
              console.error("Error saving updated Reminder to JSON:", err);
            } else {
              console.log("Updated Reminder saved to JSON.");
            }
          }
        );
      } else if (remindcheck && remindcheck.length > 0) {
        let reminderMessage = `@${userstate["username"]}, here are your reminders:`;

        remindcheck.forEach((reminder, index) => {
          reminderMessage += ` ${index + 1}. From: ${reminder.sender} - ${
            reminder.message
          } (${humanizeDuration(
            new Date().getTime() - Date.parse(reminder.time),
            { round: true }
          )} ago) `;
        });

        const maxMessageLength = 450; // Maximum allowed length of a single message
        const messageChunks = [];

        // Split the reminderMessage into chunks that fit within the maximum message length
        while (reminderMessage.length > maxMessageLength) {
          messageChunks.push(reminderMessage.slice(0, maxMessageLength));
          reminderMessage = reminderMessage.slice(maxMessageLength);
        }
        messageChunks.push(reminderMessage);

        // Send each message with the appropriate delay
        const delayTime = 1500; // 1.5 seconds in milliseconds
        messageChunks.forEach((chunk, index) => {
          setTimeout(
            () => {
              client.action(channel, chunk);
            },
            index === 0 ? 0 : delayTime * index
          );
        });

        // Clear all reminders for the user after sending them
        client.remind.delete(userstate["username"].toLowerCase());

        fs.writeFile(
          "/home/ubuntu/BOT/reminderslist.json",
          JSON.stringify(Array.from(client.remind)),
          (err) => {
            if (err) {
              console.error("Error saving updated Reminders to JSON:", err);
            } else {
              console.log("Updated Reminders saved to JSON.");
            }
          }
        );
      }
    }
  );

  let gncheck = gn.get(userstate["user-id"]);
  if (gncheck) {
    gn.delete(userstate["user-id"]);
    client.action(
      channel,
      `${userstate["username"]} just woke up 🛏 🧍 : ${
        gncheck.reason
      } (${humanizeDuration(new Date().getTime() - Date.parse(gncheck.time), {
        round: true,
      })})`
    );
    fs.writeFile(
      "/home/ubuntu/BOT/gnstatus.json",
      JSON.stringify(Array.from(client.gn)),
      (err) => {
        if (err) {
          console.error("Error saving updated GN status to JSON:", err);
        } else {
          console.log("Updated GN status saved to JSON.");
        }
      }
    );
  }

  let afkcheck = afk.get(userstate["user-id"]);
  if (afkcheck) {
    afk.delete(userstate["user-id"]);
    client.action(
      channel,
      `${userstate["username"]} is no longer afk: ${
        afkcheck.reason
      } (${humanizeDuration(new Date().getTime() - Date.parse(afkcheck.time), {
        round: true,
      })})`
    );
    fs.writeFile(
      "/home/ubuntu/BOT/afkstatus.json",
      JSON.stringify(Array.from(client.afk)),
      (err) => {
        if (err) {
          console.error("Error saving updated AFK status to JSON:", err);
        } else {
          console.log("Updated AFK status saved to JSON.");
        }
      }
    );
  }

  if (channel === "#pajlada") {
    if (
      message === "DANKNAD 🚨 ALERTE" &&
      userstate["user-id"] == "137690566"
    ) {
      client.action(channel, "PAJAS 🚨 POPLACH");
    }
  }

  if (channel === "#felyp8") {
    if (message === "test") {
      fs.readFile("/home/ubuntu/BOT/counter.txt", "utf8", function (err, data) {
        if (err) {
          console.log("Error reading file:", err);
        } else {
          console.log("Current count:", parseInt(data));
          let count = data;

          client.action(channel, `Test number ${count} successful LaterGator `);

          count++;
          fs.writeFile("/home/ubuntu/BOT/counter.txt", count, function (err) {
            if (err) {
              console.log("Error writing file:", err);
            } else {
              console.log("Count updated to:", count);
            }
          });
        }
      });
    }
  }

  if (channel === "#mastertichus") {
    if (message === "test") {
      fs.readFile(
        "/home/ubuntu/BOT/counter2.txt",
        "utf8",
        function (err, data) {
          if (err) {
            console.log("Error reading file:", err);
          } else {
            console.log("Current count:", parseInt(data));
            let count = data;

            client.action(channel, `Test number ${count} successful xD `);

            count++;
            fs.writeFile(
              "/home/ubuntu/BOT/counter2.txt",
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

  const args = message
    .replace("\u{E0000}", "")
    .trim()
    .slice(1)
    .split(" ")
    .filter((element) => element);
  const commandName = args.shift().toLowerCase();

  const command = commands.get(commandName);

  async function isStreamLive(channel) {
    try {
      const response = await axios.get(
        `https://api.twitch.tv/helix/streams?user_login=${channel}`,
        {
          headers: {
            "Client-ID": process.env.NEW_client_id,
            Authorization: `Bearer ${process.env.NEW_access_token}`,
          },
        }
      );

      return response.data.data.length > 0;
    } catch (error) {
      console.error("Error checking stream status:", error);
      return false;
    }
  }

  fs.readFile(
    "/home/ubuntu/BOT/offlineonly.json",
    "utf8",
    async (err, jsonData) => {
      if (err) {
        console.error("Error reading JSON file:", err);
        return;
      }
      offlineOnly = JSON.parse(jsonData);

      const channelsToCheck = offlineOnly;
      console.log("Offline Only Channels: ", offlineOnly);
      const liveChannels = [];

      for (const channel of channelsToCheck) {
        const isChannelLive = await isStreamLive(channel);
        if (isChannelLive) {
          liveChannels.push(channel);
        }
      }

      if (
        command &&
        channelsToCheck.includes(channel.replace("#", "")) &&
        liveChannels.includes(channel.replace("#", ""))
      ) {
        console.log("Couldn't send a message (Channel is live)");
        console.log("Live Offline Only Channels: ", liveChannels);
        return;
      }
      // Execute Commands
      if (commands.has(commandName)) {
        try {
          // Execute the normal command
          command.execute(client, channel, userstate, args, message);
        } catch (error) {
          console.error(error);
          client.say(channel, "An error occurred while executing the command.");
        }
      } else {
        fs.readFile(customCommandsFilePath, "utf8", (err, jsonData) => {
          if (err) {
            console.error("Error reading Command JSON file:", err);
            return;
          }
          const commandsArray = JSON.parse(jsonData);

          getUserInfo(channel)
            .then((userCheck) => {
              if (userCheck) {
                const uid = userCheck[0].id;
                const channelCommandsEntry = commandsArray.find(
                  (entry) => entry[0] === uid
                );

                if (channelCommandsEntry) {
                  const customCommands = channelCommandsEntry[1];
                  const commandToExecute = customCommands.find(
                    (customcommand) => customcommand.commandName === commandName
                  );

                  if (commandToExecute) {
                    console.log("commandToExecute:", commandToExecute);
                    client.say(channel, commandToExecute.response);
                    // Execute the command
                  } else {
                    console.log(
                      `No custom command found with name "${commandName}" in channel "${channel}"`
                    );
                  }
                } else {
                  console.log(
                    `No custom commands found for channel "${channel}"`
                  );
                }
              } else {
                console.log("User does not exist");
              }
            })
            .catch((error) => {
              console.error("Error in getUserInfo:", error);
            });
        });

        function getUserInfo(channel) {
          return got(
            `https://api.ivr.fi/v2/twitch/user?login=${channel.replace(
              "#",
              ""
            )}`,
            {
              responseType: "json",
              throwHttpErrors: false,
            }
          )
            .then((response) => {
              const userCheck = response.body;
              return userCheck;
            })
            .catch((error) => {
              console.error("An error occurred:", error);
              throw error;
            });
        }
      }
    }
  );
});
