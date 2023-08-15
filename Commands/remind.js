const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  client  = require('/home/ubuntu/BOT/BOTv2.js')
const remind = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'remind',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }


      const [userTarget, ...restArgs] = args;

          let remindMessage = restArgs.join(" ") ? restArgs.join(" ") : "no message";
            let construct = {
              sender: user["username"],
              message: remindMessage,
              time: new Date().toString(),
            };
            
            let reminders = client.remind.get(userTarget) || [];
            reminders.push(construct);
            client.remind.set(userTarget.toLowerCase(), reminders);
    
            client.action(channel, `@${user.username} I will remind ${userTarget} when they next type in chat`);

            fs.writeFile('/home/ubuntu/BOT/reminderslist.json', JSON.stringify(Array.from(client.remind)), (err) => {
                if (err) {
                  console.error('Error saving Reminder to JSON:', err);
                } else {
                  console.log('Reminder saved to JSON.');
                }
            });
    }
}