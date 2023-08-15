const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'uid',
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
  
        const userCheck = await got(
          `https://api.ivr.fi/v2/twitch/user?login=${userTarget}`,
          {
            responseType: "json",
            throwHttpErrors: false,
          }
        );
        const userData = userCheck.body[0];
  
        if (userCheck.body[0] && userData.banned === true) {
          client.action(
            channel,
            `${user.username} ${userData.id} ⛔ (${userData.banReason})`
          );
        } else if (!userCheck.body[0]) {
          client.action(channel, "This user does not exist...")
        } else {
          client.action(channel, `${user.username} ${userData.id}`);
        }
    }
}