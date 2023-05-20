const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'join',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if (user['user-id'] == "162760707") {
          let userTarget = user.username;
          if (args[0]) {
            if (args[0].startsWith("@")) {
              args[0] = args[0].substring(1);
            }
            userTarget = args[0];
          }
        
          const userCheck = await got(
            `https://api.ivr.fi/v2/twitch/user/${userTarget}`,
            {
              responseType: "json",
              throwHttpErrors: false,
            }
          );
          if (!userCheck.body.id || userCheck.body.banned == true) {
            client.action(channel, `This user does not exist or is banned.`);
            return;
          }
          client.join(userTarget);
      
          client.action(channel, `Joined channel ${userTarget}`)
      
          const newData = userTarget;
        
          let channelData = [];
          try {
            const jsonData = fs.readFileSync('/home/ubuntu/BOT/channels.json', 'utf8');
            channelData = JSON.parse(jsonData);
          } catch (err) {
            console.error('Error reading JSON file:', err);
          }
        
          channelData.push(newData);
      
          try {
            const jsonData = JSON.stringify(channelData, null, 2);
            fs.writeFileSync('/home/ubuntu/BOT/channels.json', jsonData, 'utf8');
            console.log('Channels have been updated and saved to channels.json');
          } catch (err) {
            console.error('Error writing JSON file:', err);
          }
        }
    }
}