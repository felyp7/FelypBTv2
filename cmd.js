const checkCooldown = require('/home/ubuntu/BOT/BOTv2.js');
const client = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const isModUp = require("/home/ubuntu/BOT/BOTv2.js")
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'cmd',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        let isMod = user.mod || user["user-type"] === "mod";
        let isBroadcaster = channel.slice(1) === user.username;
        let isModUp = isMod || isBroadcaster;
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if (remainingCooldown !== null) {
            return;
        }

        if (isModUp || user["user-id"] === "162760707") {
            

        const userCheck = await got(
            `https://api.ivr.fi/v2/twitch/user?login=${channel.replace("#","")}`,
            {                  
                responseType: "json",
                throwHttpErrors: false,
                }
            );
            const uid = userCheck.body[0].id;
        const customCommandsFilePath = "/home/ubuntu/BOT/commandData.json"

        fs.readFile(customCommandsFilePath, "utf8", (err, jsonData) => {
            if (err) {
              console.error("Error reading Command JSON file:", err);
              return;
            }
            commandsArray = JSON.parse(jsonData);
        })
        client.cmd = new Map(commandsArray)

        const [operation, commandName, ...response] = args;
        let commandsList = client.cmd.get(uid) || [];
        let existingCommand = commandsList.find(cmd => cmd.commandName === commandName);

        switch (operation) {
            case 'add':

            if (!args[2]) {
                client.action(channel, "Provide a response...")
                ;return;
            }

        let construct = {
            creator: user.username,
            commandName: commandName,
            response: response.join(" "),
        };

        if (existingCommand) {
            client.action(channel, "This command already exists...")
            ;return;
        } else {
            commandsList.push(construct); // Add the new command
        }
        
        client.cmd.set(uid, commandsList);

        client.action(channel, `@${user.username} Command ${commandName} successfully created`);

        
        fs.writeFile('/home/ubuntu/BOT/commandData.json', JSON.stringify(Array.from(client.cmd), null, 1), (err) => {
            if (err) {
                console.error('Error saving Command to JSON:', err);
            } else {
                console.log('Command saved to JSON.');
            }
        });

        
        
        break;
        case 'del':
            if (existingCommand) {
                // Remove the existing command from the commandsList
                commandsList = commandsList.filter(cmd => cmd !== existingCommand);
                client.action(channel, `Command ${commandName} successfully removed...`)
            } else {
                client.action(channel, "This command does not exist...");
            }
        
            // Update the client.cmd with the modified commandsList
            client.cmd.set(uid, commandsList);
        
            fs.writeFile('/home/ubuntu/BOT/commandData.json', JSON.stringify(Array.from(client.cmd), null, 1), (err) => {
                if (err) {
                    console.error('Error saving Command to JSON:', err);
                } else {
                    console.log('Command saved to JSON.');
                }
            });
            break;
        }
    } else {
        console.log("Couldn't create a command [Not a mod]")
    }
} 
}
