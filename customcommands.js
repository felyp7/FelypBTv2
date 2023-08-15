const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");
const path = require("path");
module.exports = {
    name: 'customcommands', 
    description: 'List all custom commands for the channel',
    cooldown: 5, 
    execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if (remainingCooldown !== null) {
            return;
        }

        const customCommandsFilePath = "/home/ubuntu/BOT/commandData.json"

        fs.readFile(customCommandsFilePath, "utf8", async (err, jsonData) => {
            if (err) {
              console.error("Error reading Command JSON file:", err);
              return;
            }

            const userCheck = await got(
                `https://api.ivr.fi/v2/twitch/user?login=${channel.replace("#","")}`,
                {                  
                    responseType: "json",
                    throwHttpErrors: false,
                    }
                );
                const uid = userCheck.body[0].id;

        commandsArray = JSON.parse(jsonData);
        const channelCommands = commandsArray.find(entry => entry[0] === uid);
        
        if (channelCommands) {
            const customCommands = channelCommands[1];

            if (customCommands.length === 0) {
                client.action(channel, "No custom commands found for this channel.");
            } else {
                const commandNames = customCommands.map(command => command.commandName);
                const commandList = commandNames.join(', ');
                client.action(channel, `Custom commands for this channel: ${commandList}`);
            }
        } else {
            client.action(channel, "No custom commands found for this channel.");
            }
        })
    }
};
