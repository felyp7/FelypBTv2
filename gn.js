const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  client  = require('/home/ubuntu/BOT/BOTv2.js')
const gn = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'gn',
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
      

          let gnMessage = args.join(" ") ? args.join(" ") : "no message";
          let gnlist = client.gn.get(user["user-id"]);
          if (!gnlist) {
            let construct = {
              id: user["user-id"],
              reason: gnMessage,
              time: new Date().toString(),
            };
            client.gn.set(user["user-id"], construct);
    
            client.action(channel, `@${user.username} is now sleeping 🛌💤 : ${gnMessage}`);

            fs.writeFile('/home/ubuntu/BOT/gnstatus.json', JSON.stringify(Array.from(client.gn)), (err) => {
                if (err) {
                  console.error('Error saving GN status to JSON:', err);
                } else {
                  console.log('GN status saved to JSON.');
                }
            });
        }
    }
}