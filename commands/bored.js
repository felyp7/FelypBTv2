const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  client  = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'bored',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if (remainingCooldown !== null) {
            return;
        }
        const data = await got("http://www.boredapi.com/api/activity/", {
            responseType: "json",
            throwHttpErrors: false,
          });
    
          const activity = data.body.activity;
          const type = data.body.type;
    
          client.action(channel, `${user.username}, (${type}) ${activity}`);
    }
}