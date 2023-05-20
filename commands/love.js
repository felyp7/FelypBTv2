const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'love',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if (args[1]) {
            client.action(
              channel,
              `Love between ${args[0]} and ${args[1]} is ${
                Math.floor(Math.random() * 100) + 1
              }% PogChamp ❤  `
            );
            return;
          }
          client.action(
            channel,
            `Love between ${user.username} and ${args[0]} is ${
              Math.floor(Math.random() * 100) + 1
            }% PogChamp ❤  `
          );
    }
}