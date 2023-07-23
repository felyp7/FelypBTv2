const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'title',
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
  
        if (args[0] == null) {
          let title = await got(
            `https://decapi.me/twitch/title/${channelTarget}?`
          );
          let data = title.body;
  
          client.action(channel, `Title is: ${data}`);
          return;
        }
  
        let title = await got(`https://decapi.me/twitch/title/${userTarget}?`);
        let data = title.body;
  
        client.action(channel, `Title is: ${data}`);
    }
}