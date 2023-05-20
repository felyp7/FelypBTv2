const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'eval',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if(user["user-id"] == "162760707") {
            const evalueted = await eval("(async () => {" + args.join(" ") + "})()");
            const ev = String(evalueted) || "";
            client.say(channel, ev);
        }
    }
}