const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const humanizeDuration = require("humanize-duration");
const got = require("got");


module.exports = {
    name: 'ping',
    description: 'xD',
    cooldown: 5,
    execute(client, channel, user) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        function formatDuration(durationSeconds) {
            const days = Math.floor(durationSeconds / 86400);
            const hours = Math.floor((durationSeconds % 86400) / 3600);
            const minutes = Math.floor((durationSeconds % 3600) / 60);
            const seconds = Math.floor(durationSeconds % 60);
          
            const daysString = days > 0 ? days + ' days' : '';
            const hoursString = hours > 0 ? hours + ' hours' : '';
            const minutesString = minutes > 0 ? minutes + ' minutes' : '';
            const secondsString = seconds > 0 ? seconds + ' seconds' : '';
          
            const parts = [daysString, hoursString, minutesString, secondsString];
            const filteredParts = parts.filter(part => part !== '');
            if (filteredParts.length === 0) {
              return 'less than a second';
            } else {
              return filteredParts.join(', ');
            }
          }
          
          const uptimeSeconds = process.uptime();
          const uptimeFormatted = formatDuration(uptimeSeconds);

        console.log(`${uptimeFormatted}`)

        if (remainingCooldown !== null) {
            return;
        }

        client.ping(channel).then(function (data) {
            console.log(data);
    
            client.action(
              channel,
              `FeelsDankMan 🏓 Pong! FelypBT v2 Latency is ${Math.floor(
                Math.round(data * 1000)
              )}ms | Bot Uptime: ${uptimeFormatted} | RAM: ${Math.round(
                process.memoryUsage().rss / 1024 / 1024
              )}mb | Channels: ${client.getChannels().length}`
            );
        })   
    }
}