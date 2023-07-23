const checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'whois',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }        let userTarget = user.username;
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
        `https://api.ivr.fi/v2/twitch/user?login=${username}`,
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
      const userColor = userData.chatColor;

      const userId = userData.id;
      const userAvatar = userData.logo;
      const userBio = userData.bio;
      const userBanned = userData.banned;
      const userPartner = userData.roles.isPartner;
      const userAffiliate = userData.roles.isAffiliate;
      const userBot = userData.verifiedBot;
      const userBanner = userData.banner;

      const uid = userId;
      const avatar = userAvatar;
      const bio = userBio;
      const isbanned = userBanned;
      const isPartner = userPartner;
      const isAffiliate = userAffiliate;
      const isBot = userBot;
      const banner = userBanner;

      const creation = await got(
        `https://decapi.me/twitch/creation/${userTarget}`
      );
      let creationDate = creation.body;

      if (userColor == null) {
        if (userData.badges[0] == undefined) {
          client.say(
            channel,
            `@${user.username} ${userTarget}, Banned: ${isbanned}, Partner: ${isPartner}, Affiliate: ${isAffiliate}, Bot: ${isBot}, Badge: No badge, Avatar: ${avatar} , Profile Banner: ${banner} , Color: Default color (Never set), Account created at ${creationDate}, id: ${uid}, bio: ${bio}`
          );
          return;
        } else {
          let userBadge = userData.badges[0].title;
          let badge = userBadge;
          client.say(
            channel,
            `@${user.username} ${userTarget}, Banned: ${isbanned}, Partner: ${isPartner}, Affiliate: ${isAffiliate}, Bot: ${isBot}, Badge: ${badge}, Avatar: ${avatar} , Profile Banner: ${banner} ,  Color: Default color (Never set), Account created at ${creationDate}, id: ${uid}, bio: ${bio}`
          );
          return;
        }
      }

      const colorName = await got(
        `https://www.thecolorapi.com/id?hex=${userColor.replace("#", "")}`
      ).json();

      if (userData.badges[0] == undefined) {
        client.say(
          channel,
          `@${user.username} ${userTarget}, Banned: ${isbanned}, Partner: ${isPartner}, Affiliate: ${isAffiliate}, Bot: ${isBot}, Badge: No badge, Avatar: ${avatar} , Profile Banner: ${banner} ,  Color: ${userColor} (${colorName.name.value}), Account created at ${creationDate}, id: ${uid}, bio: ${bio}`
        );
        return;
      } else {
        let userBadge = userData.badges[0].title;
        let badge = userBadge;

        client.say(
          channel,
          `@${user.username} ${userTarget}, Banned: ${isbanned}, Partner: ${isPartner}, Affiliate: ${isAffiliate}, Bot: ${isBot}, Badge: ${badge}, Avatar: ${avatar} , Profile Banner: ${banner} ,  Color: ${userColor} (${colorName.name.value}), Account created at ${creationDate}, id: ${uid}, bio: ${bio}`
        );
      }
    }
}