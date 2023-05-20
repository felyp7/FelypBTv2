const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'fact',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        const request = require("request");
        request.get(
        {
          url: "https://api.api-ninjas.com/v1/facts?limit=1",
          headers: {
            "X-Api-Key": process.env.ninjaapikey,
          },
        },
        function (error, response, body) {
          if (error) return console.error("Request failed:", error);
          else if (response.statusCode != 200)
            return console.error(
              "Error:",
              response.statusCode,
              body.toString("utf8")
            );
          else console.log(body);
          data = JSON.parse(body);
          client.action(channel, `${data[0].fact} forsenScoots`);
        }
      );
    }
}