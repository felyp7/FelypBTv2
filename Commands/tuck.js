const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  client = require('/home/ubuntu/BOT/BOTv2.js')
const  isModUp  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'tuck',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }        let channelTarget = channel.replace("#", "");

    const got = require("got");

    const data = await got(
      `https://emotes.adamcy.pl/v1/channel/${channelTarget}/emotes/7tv.bttv.ffz.twitch`
    );

    let emotes = [];

    JSON.parse(data.body).map((e) => {
      emotes.push(e.code);
    });

    let userTarget = user.username;
    if (args[0]) {
      if (args[0].startsWith("@")) {
        args[0] = args[0].substring(1);
      }
      userTarget = args[0];
    }

    if (emotes.includes(args[1])) {
      client.action(
        channel,
        `@${user.username} tucked ${userTarget} to bed ${args[1]} 👉 🛏`
      );
    } else {
      if (userTarget == user.username) {
        client.say(
          channel,
          `@${user.username} tucked himself to bed Sadge 👉 🛏 `
        );
        return;
      }

      client.action(
        channel,
        `@${user.username} tucked ${userTarget} to bed FeelsOkayMan 👉 🛏 `
      );
    }
    }
}