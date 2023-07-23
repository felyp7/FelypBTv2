const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  isModUp  = require('/home/ubuntu/BOT/BOTv2.js');
const  client  = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'pyramid',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }        if(isModUp || user["user-id"] === "162760707") {
            if (!args[1] || isNaN(parseInt(args[0]))) {
                return client.say(channel, `Usage: 'pyramid 1-100 message`);
              }
              if (parseInt(args[0]) < 1 || parseInt(args[0]) > 100) {
                return client.say(channel, `Height needs to be between 1 and 100`);
              }
              if (
                parseInt(args[0]) >
                parseInt(500 / (args.slice(1).join(" ").length + 1))
              ) {
                return client.say(
                  channel,
                  `Max possible height for message is ${parseInt(
                    498 / (args.slice(1).join(" ").length + 1)
                  )}`
                );
              }
              let msg = "";
              let phrase = args.slice(1).join(" ");
              block = true;
              setTimeout(() => {
                block = false;
              }, 5 * 1000);
              for (let i = 1; i < parseInt(args[0]) * 2; i++) {
                (function (ind) {
                  setTimeout(function () {
                    if (i < parseInt(args[0]) + 1) msg += `${phrase} `;
                    else msg = msg.substring(phrase.length + 1);
                    client.say(channel, `${msg}`);
                  }, 70 * (ind + 1));
                })(i);
              }
        }
    }
}