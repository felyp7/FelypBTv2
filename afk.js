const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  client  = require('/home/ubuntu/BOT/BOTv2.js')
const afk = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'afk',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }
        let userTarget = user.username;
      if (args[0]) {
        if (args[0].startsWith("@")) {
          args[0] = args[0].substring(1);
        }
        userTarget = args[0];
      }

      let channelTarget = channel.replace("#", "");
      if (args[1]) {
        channelTarget = args[1];
      }
      

          let afkMessage = args.join(" ") ? args.join(" ") : "no message";
          let afklist = client.afk.get(user["user-id"]);
          if (!afklist) {
            let construct = {
              id: user["user-id"],
              reason: afkMessage,
              time: new Date().toString(),
            };
            client.afk.set(user["user-id"], construct);
    
            client.action(channel, `@${user.username} is afk: ${afkMessage}`);

            fs.writeFile('/home/ubuntu/BOT/afkstatus.json', JSON.stringify(Array.from(client.afk)), (err) => {
                if (err) {
                  console.error('Error saving AFK status to JSON:', err);
                } else {
                  console.log('AFK status saved to JSON.');
                }
            });
        }
    }
}