const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'vagina',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }        client.action(
            channel,
            `@${user.username} ${args.join(" ")} 's vagina is ${
              Math.floor(Math.random() * 17) + 1
            }cm deep Okayge`
          );
    }
}