const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'subage',
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

      const bCheck = await got(
        `https://api.ivr.fi/twitch/resolve/${userTarget}`,
        {
          responseType: "json",
          throwHttpErrors: false,
        }
      );

      const cCheck = await got(
        `https://api.ivr.fi/twitch/resolve/${channelTarget}`,
        {
          responseType: "json",
          throwHttpErrors: false,
        }
      );

      let channelCheck = cCheck.body;
      let banCheck = bCheck.body;

      const channelid = channelCheck.id;
      const ban = banCheck.banned;

      if (!channelid) {
        client.action(channel, "Channel was not found.");
        return;
      }

      if (ban == true) {
        client.action(channel, "No data found. User is probably banned.");
        return;
      }

      const subage = await got(
        `https://api.ivr.fi/twitch/subage/${userTarget}/${channelTarget}`
      );
      let data = JSON.parse(subage.body);

      console.log(data);

      const tier = data.meta.tier;
      const type = data.meta.type;
      const months = data.cumulative.months;
      const anniversary = data.cumulative.remaining;
      const endsin = data.streak.remaining;
      const streak = data.streak.months;

      const userCheck = await got(
        `https://api.ivr.fi/twitch/resolve/${userTarget}`,
        {
          responseType: "json",
          throwHttpErrors: false,
        }
      );

      const userData = userCheck.body;

      const userBanned = userData.banned;
      const isbanned = userBanned;

      if (months == undefined || months == 0) {
        client.action(
          channel,
          `${userTarget} isn't subscribed to ${channelTarget}.`
        );
        return;
      }

      if (data.subscribed == false) {
        client.action(
          channel,
          `${userTarget} isn't subscribed to ${channelTarget}, but used to be subscribed for ${months} months.`
        );
        return;
      }

      if (type == "gift") {
        const giftedby = data.meta.gift.name;
        const banned = data.error;

        client.action(
          channel,
          `User ${userTarget} is subscribed to ${channelTarget} for ${months} cumulative months with tier ${tier} gifted by ${giftedby} and is on ${streak} months streak. Next anniversary is in ${anniversary} days.`
        );
        return;
      }

      if (type == "paid") {
        const banned = data.error;

        client.action(
          channel,
          `User ${userTarget} is subscribed to ${channelTarget} for ${months} cumulative months with tier ${tier} and is on ${streak} months streak. Next anniversary is in ${anniversary} days.`
        );
        return;
      }

      if (type == "prime") {
        const banned = data.error;

        client.action(
          channel,
          `User ${userTarget} is subscribed to ${channelTarget} for ${months} cumulative months with Prime and is on ${streak} months streak. Next anniversary is in ${anniversary} days.`
        );
        return;
      }
    }
}