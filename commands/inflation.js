const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'inflation',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        const request = require("request");
      if (args[0] == null) {
        client.action(channel, "Enter a country...");
        return;
      }
      request.get(
        {
          url:
            "https://api.api-ninjas.com/v1/inflation?country=" + args.join(" "),
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
          client.action(
            channel,
            `${data[0].country} - Monthly pct: ${data[0].monthly_rate_pct} Yearly pct: ${data[0].yearly_rate_pct}`
          );
        }
      );
    }
}