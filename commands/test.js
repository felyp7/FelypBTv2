const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  checkModeratorAndVIP  = require('/home/ubuntu/BOT/ismodisvip.js');
const humanizeDuration = require("humanize-duration");
const got = require("got");


module.exports = {
    name: 'xd',
    description: 'xD',
    cooldown: 5,
    execute(client, channel, user) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if (remainingCooldown !== null) {
            return;
        }

        checkModeratorAndVIP(channel)
        .then(({ isModerator, isVIP }) => {
          console.log('Bot is a moderator:', isModerator);
          console.log('Bot is a VIP:', isVIP);

          if (isModerator == false && isVIP == false) {
            client.say(channel, "No")
            ;return;
          } else {
            client.say(channel, "Yes")
          }

        });

    }
}