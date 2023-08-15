const checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
  name: 'offlineonly',
  description: 'xD',
  cooldown: 5,
  async execute(client, channel, user, args) {
    const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
    if (remainingCooldown !== null) {
      return;
    }
    if (user['user-id'] == "162760707") {
      let userTarget = user.username;
      if (args[1]) {
        if (args[1].startsWith("@")) {
          args[1] = args[1].substring(1);
        }
        userTarget = args[1];
      }

      let offlineOnly = [];
      try {
        const jsonData = fs.readFileSync('/home/ubuntu/BOT/offlineonly.json', 'utf8');
        offlineOnly = JSON.parse(jsonData);
      } catch (err) {
        console.error('Error reading JSON file:', err);
      }

      if (args[0] === "add") {
        try {
          offlineOnly.push(userTarget.toLowerCase())
          const jsonData = JSON.stringify(offlineOnly, null, 2);
          fs.writeFileSync('/home/ubuntu/BOT/offlineonly.json', jsonData, 'utf8');
          console.log('Channels have been updated and saved to offlineonly.json');
        } catch (err) {
          console.error('Error writing JSON file:', err);
        }
        return;
      }

      if (args[0] === "remove") {
        const channelIndex = offlineOnly.indexOf(userTarget.toLowerCase());
        if (channelIndex !== -1) {
          offlineOnly.splice(channelIndex, 1);

          const jsonData = JSON.stringify(offlineOnly);
          fs.writeFile('/home/ubuntu/BOT/offlineonly.json', jsonData, 'utf8', (err) => {
            if (err) {
              console.error('Error writing JSON file:', err);
            } else {
              console.log(`Channel '${userTarget}' has been removed from the JSON file.`);
            }
          });
        }
      }
    }
  }
};
