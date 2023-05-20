const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'part',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if (user['user-id'] == "162760707") {
            let userTarget = channel.replace("#", "");
            if (args[0]) {
              if (args[0].startsWith("@")) {
                args[0] = args[0].substring(1);
              }
              userTarget = args[0];
            }
        
            let channelData = [];
            try {
              const jsonData = fs.readFileSync('/home/ubuntu/BOT/channels.json', 'utf8');
              channelData = JSON.parse(jsonData);
            } catch (err) {
              console.error('Error reading JSON file:', err);
            }
        
          
            const channelIndex = channelData.indexOf(userTarget);
            if (channelIndex !== -1) {
              channelData.splice(channelIndex, 1); 
        
              const jsonData = JSON.stringify(channelData);
              fs.writeFile('/home/ubuntu/BOT/channels.json', jsonData, 'utf8', (err) => {
                if (err) {
                  console.error('Error writing JSON file:', err);
                } else {
                  console.log(`Channel '${userTarget}' has been removed from the JSON file.`);
                }
              });
        
              client.part(userTarget); 
              client.action(channel, `Parted channel ${userTarget}`)
              console.log(`Left channel: ${userTarget}`);
            }
        }
    }
}