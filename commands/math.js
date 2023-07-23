const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'math',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args, message) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }        if (message.split(" ")[1] !== undefined) {
          let excersise = message.substring(
            message.split(" ")[0].length + 1,
            message.length
          );
          
            excersise = excersise.replace(/\s/g, "");
            let validnums = 0;
            let invalidnums = 0;
            for (w = 0; w < excersise.length; w++) {
              let numchar = excersise.split("")[w];
              if (!isNaN(numchar)) {
                validnums = +validnums + 1;
              } else {
                invalidnums = +invalidnums + 1;
              }
            }
            let excersisesolved = eval(excersise);
            if (excersisesolved !== isNaN) {
              client.action(
                channel,
                `${user.username} ${excersisesolved} FeelsOkayMan`
              );
            } else {
              client.action(
                channel,
                `${user.username} Not mathematical! FeelsDankMan`
              );
            }
          }
    }
}