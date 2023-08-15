const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  isModUp  = require('/home/ubuntu/BOT/BOTv2.js');
const  client  = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");



const cooldowns = {};

module.exports = {
    name: 'spam',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      let isMod = user.mod || user["user-type"] === "mod";
      let isBroadcaster = channel.slice(1) === user.username;
      let isModUp = isMod || isBroadcaster;
      
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }        if(isModUp || user["user-id"] === "162760707") {
            if (args[0] > 300) {
                client.say(channel, "the maximum size is 300");
                return;
              }
              for (var i = 0; i < args[0]; i++) {
                client.say(channel, args.slice(1).join(" "));
      
                if (i > args[0]) break;
              }
          }
    }
}