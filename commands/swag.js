const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'swag',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }        client.action(
            channel,
            `@${user.username} ${args.join(" ")} has ${
              Math.floor(Math.random() * 30) + 1
            }% swag B)`
          );
    }
}