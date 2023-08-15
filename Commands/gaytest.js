const checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  client  = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'gaytest',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }
        client.action(
            channel,
            `@${user.username} ${args.join(" ")} is  ${
              Math.floor(Math.random() * 100) + 1
            }% gay Okayge`
          );
    }
}