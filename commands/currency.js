const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  client  = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'currency',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }
        const request = require("request");
      if (args[0] == null) {
        client.action(channel, "Enter a currency...");
        return;
      }
      request.get(
        {
          url: `https://api.api-ninjas.com/v1/convertcurrency?have=${args[1]}&want=${args[3]}&amount=${args[0]}`,
          headers: {
            "X-Api-Key": process.env.ninjaapikey,
          },
        },
        function (error, response, body) {
          if (error) return console.error("Request failed:", error);
          else if (response.statusCode != 200)
            console.error("Error:", response.statusCode, body.toString("utf8"));
          else console.log(body);
          if (response.statusCode != 200) {
            client.action(channel, "Invalid currencies.");
            return;
          }
          data = JSON.parse(body);

          client.action(
            channel,
            `${data.old_amount} ${data.old_currency} = ${data.new_amount} ${data.new_currency} `
          );
        }
      );
    }
}