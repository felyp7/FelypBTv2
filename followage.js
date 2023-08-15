const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  client  = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'followage',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }        let userTarget = user.username;
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
  
        const followage = await got(
          `https://decapi.me/twitch/followage/${channelTarget}/${userTarget}?precision=5`
        ); // will return the days too
        let data = followage.body;
  
        if (data == `User not found: ${channelTarget}`) {
          client.action(channel, `${data}`);
          return;
        }
  
        if (data == `User not found: ${userTarget}`) {
          client.action(channel, `${data}`);
          return;
        }
  
        if (data == `${userTarget} does not follow ${channelTarget}`) {
          client.action(channel, `${data}`);
          return;
        }
  
        client.action(
          channel,
          `User ${userTarget} has been following ${channelTarget} for ${data}`
        );
    }
}