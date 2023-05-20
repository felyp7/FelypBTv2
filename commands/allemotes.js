const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const { isModUp } = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'allemotes',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if(isModUp || user["user-id"] === "162760707") {
        let channelTarget = channel.replace("#", "");
        if (args[0]) {
          channelTarget = args[0];
        }

        const got = require("got");

        const data = await got(
          `https://emotes.adamcy.pl/v1/channel/${channelTarget}/emotes/7tv.bttv.ffz.twitch`
        );
        let emotes = [];

        JSON.parse(data.body).map((e) => {
          emotes.push(e.code);
        });

        client.say(channel, `${emotes.join(" ")}`);
        }
    }
}