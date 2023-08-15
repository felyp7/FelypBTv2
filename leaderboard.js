const {checkCooldown} = require('/home/ubuntu/BOT/BOTv2.js');
const fs = require("fs");

module.exports = {
    name: 'leaderboard',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {

        const eggrollsFile = require('/home/ubuntu/BOT/eggrolls.json');
        const top = Object.entries(eggrollsFile).sort((a, b) => b[1] - a[1]).slice(0, 3)
        console.log(top)
        client.action(channel, `@${user.username} 🥇  ${top[0][0]}: ${top[0][1]} | 🥈  ${top[1][0]}: ${top[1][1]} | 🥉  ${top[2][0]}: ${top[2][1]}`)
    }
}