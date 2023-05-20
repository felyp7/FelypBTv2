const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'query',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        const data = await got(
            `https://api.wolframalpha.com/v1/result?appid=${
              process.env.wolfram_api_key
            }&i=${args.join(" ")}`,
            {
              throwHttpErrors: false,
            }
          );
          client.action(channel, data.body);
    }
}