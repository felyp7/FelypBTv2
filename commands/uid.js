const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'uid',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
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
  
        const userCheck = await got(
          `https://api.ivr.fi/v2/twitch/user/${userTarget}`,
          {
            responseType: "json",
            throwHttpErrors: false,
          }
        );
        const userData = userCheck.body;
  
        const userBanned = userData.banned;
        const isbanned = userBanned;
  
        if (isbanned == true) {
          client.action(
            channel,
            `${user.username} ${userData.id} ⛔ (${userData.banReason})`
          );
          return;
        }
        client.action(channel, `${user.username} ${userData.id}`);
    }
}