const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const randomHexColor = require('random-hex-color')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
  name: 'randomcolors',
  description: 'xD',
  cooldown: 5,
  async execute(client, channel, user, args) {
    const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
    if (remainingCooldown !== null) {
      return;
    }        

    if (user.username === "felyp8" && channel === "#felypbt") {
      console.log(args[0]);
      console.log(args[1]);

      for (var j = 0; j < args[0]; j++) {
        setTimeout(async () => {
          
          color = randomHexColor()
          console.log(color)

          const colorName = await got(
            `https://www.thecolorapi.com/id?hex=${color.replace("#", "")}`
          ).json();

          await got({
            url: `https://api.twitch.tv/helix/chat/color?user_id=743355647&color=${encodeURIComponent(color)}`,
            headers: {
              "Client-Id": process.env.NEW_client_id,
              Authorization: `Bearer ${process.env.NEW_access_token}`,
            },
            method: "PUT"
          });

          console.log("Changed to random color...");
          client.action(channel, `${colorName.name.value} ${color} ████`);
        }, 200*j); // Delay before each iteration based on loop index
      }

      fs.readFile("/home/ubuntu/BOT/color.txt", async (err, data) => {

          await got({
            url: `https://api.twitch.tv/helix/chat/color?user_id=743355647&color=${encodeURIComponent(data)}`,
            headers: {
              "Client-Id": process.env.NEW_client_id,
              Authorization: `Bearer ${process.env.NEW_access_token}`,
            },
            method: "PUT"
          });
          console.log("Changed to bot color...");
        }, 1000 * args[0] + 500); // Delay after all iterations based on args[0]
      }
    }
}
