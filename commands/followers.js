const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'followers',
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
  
        if (args[0]) {
          let followers = await got(
            `https://decapi.me/twitch/followcount/${userTarget}`
          );
          let data = followers.body;
  
          client.action(channel, `${userTarget} has ${data} followers`);
          return;
        }
  
        const followers = await got(
          `https://decapi.me/twitch/followcount/${channelTarget}`
        );
        let data = followers.body;
        client.action(channel, `${channelTarget} has ${data} followers`);
    }
}