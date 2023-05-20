const { runTime, client } = require('/home/ubuntu/BOT/BOTv2.js')
const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
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
    
            client.action(
              channel,
              `xD`
            );
    }
}