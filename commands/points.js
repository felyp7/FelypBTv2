const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

const eggrollsFile = '/home/ubuntu/BOT/eggrolls.json';
let usersData = {};
try {
  const jsonData = fs.readFileSync(eggrollsFile, 'utf8');
  usersData = JSON.parse(jsonData);
} catch (err) {
  console.error('Error reading JSON file:', err);
}

module.exports = {
    name: 'points',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args, message) {
        console.log(user)
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        let userTarget = user;
    if (args[0]) {
      if (args[0].startsWith("@")) {
        args[0] = args[0].substring(1);
      }
      userTarget = args[0];
    }

    console.log(usersData)
    const points = usersData[userTarget] || 0;

    client.action(
      channel,
      `@${user}, @${userTarget} has ${points} egg rolls HUHH 🥚 🌯`
    );
    }
}