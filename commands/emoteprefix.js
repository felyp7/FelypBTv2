const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'emoteprefix',
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
      if (args[1]) {
        channelTarget = args[1];
      }

      let username = user.username;

      if (args[0]) {
        if (args[0].startsWith("@")) {
          args[0] = args[0].substring(1);
        }
        username = args[0];
      }
      const userCheck = await got(
        `https://api.ivr.fi/v2/twitch/user/${username}`,
        {
          responseType: "json",
          throwHttpErrors: false,
        }
      );
      if (!userCheck.body.id) {
        client.action(channel, `This user does not exist.`);
        return;
      }

      const userData = userCheck.body;
      const prefix = userData.emotePrefix;

      if (prefix === "") {
        client.action(channel, `No Emote Prefix ;p `);
        return;
      }

      client.action(channel, `Emote Prefix: ${prefix} ;p `);
    }
}