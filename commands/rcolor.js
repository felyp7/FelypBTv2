const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'rcolor',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        var color = "";

      for (var i = 0; i < 3; i++) {
        var sub = Math.floor(Math.random() * 256).toString(16);
        color += sub.length == 1 ? "0" + sub : sub;
      }

      const colorName = await got(
        `https://www.thecolorapi.com/id?hex=${color.replace("#", "")}`
      ).json();

      await got(
        `https://api.twitch.tv/helix/chat/color?user_id=743355647&color=${encodeURIComponent(
          "#" + color
        )}`,
        {
          headers: {
            "Client-Id": process.env.NEW_client_id,
            Authorization: `Bearer ${process.env.NEW_access_token}`,
          },
          method: "PUT",
        },
        console.log("Changed to random color...")
      );
      setTimeout(() => {
        client.action(channel, `${colorName.name.value} #${color} ████`);
      }, 200);

      fs.readFile("/home/ubuntu/BOT/color.txt", async (err, data) => {
        setTimeout(async () => {
          await got(
            `https://api.twitch.tv/helix/chat/color?user_id=743355647&color=${encodeURIComponent(
              data
            )}`,
            {
              headers: {
                "Client-Id": process.env.NEW_client_id,
                Authorization: `Bearer ${process.env.NEW_access_token}`,
              },
              method: "PUT",
            },
            console.log("Changed to bot color...")
          );
        }, 500);
      });
    }
}