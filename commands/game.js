const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'game',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        let userTarget = user.username;
      if (args[0]) {
        if (args[0].startsWith("@")) {
          args[0] = args[0].substring(1);
        }
        userTarget = args[0];
      }

      let channelTarget = channel.replace("#", "");
      if (args[0]) {
        channelTarget = args[0];
      }

      if (args[0] == null) {
        let game = await got(`https://decapi.me/twitch/game/${channelTarget}?`);
        let data = game.body;

        client.action(
          channel,
          `${channelTarget} is currently playing  ${data}`
        );
        return;
      }
      let game = await got(`https://decapi.me/twitch/game/${userTarget}?`);
      let data = game.body;

      client.action(channel, `${userTarget} is currently playing  ${data}`);

    }
}