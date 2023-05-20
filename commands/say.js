const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'say',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if(user.username === "felyp8") {
            const [channelTarget, ...restArgs] = args;
            const text = restArgs.join(" ");
      
            client.say(`${channelTarget}`, `${restArgs.join(" ")}`);
        }
    }
}