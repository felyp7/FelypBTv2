const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'setcolor',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        var color = args[0];
        let defaultcolors = [
          "Blue",
          "Blue_Violet",
          "Cadet_Blue",
          "Chocolate",
          "Coral",
          "Dodger_Blue",
          "Firebrick",
          "Golden_Rod",
          "Green",
          "Hot_Pink",
          "Orange_Red",
          "Red",
          "Sea_Green",
          "Spring_Green",
          "Yellow_Green",
        ];
        var found = defaultcolors.find((element) => {
          return element.toLowerCase() === color.toLowerCase();
        });
        console.log(found);
        if (found) {
          await got(
            `https://api.twitch.tv/helix/chat/color?user_id=743355647&color=${encodeURIComponent(
              found.toLowerCase()
            )}`,
            {
              headers: {
                "Client-Id": process.env.NEW_client_id,
                Authorization: `Bearer ${process.env.NEW_access_token}`,
              },
              method: "PUT",
            }
          );
  
          client.action(channel, `Color changed to ${found} (${found})`);
  
          fs.writeFileSync("/home/ubuntu/BOT/color.txt", `${color}`, (err) => {
            if (err) {
              console.error(err);
            }
          });
          return;
        }
        if (!color.startsWith("#") && found == undefined) {
          if (
            client.action(
              channel,
              "Color has to be in a hex code or a default twitch color name."
            )
          );
          return;
        }
  
        const validColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!validColor.test(color)) {
          client.action(channel, "Invalid color hex.");
          return;
        }
  
        const colorName = await got(
          `https://www.thecolorapi.com/id?hex=${color.replace("#", "")}`
        ).json();
  
        await got(
          `https://api.twitch.tv/helix/chat/color?user_id=743355647&color=${encodeURIComponent(
            color
          )}`,
          {
            headers: {
              "Client-Id": process.env.NEW_client_id,
              Authorization: `Bearer ${process.env.NEW_access_token}`,
            },
            method: "PUT",
          }
        );
  
        client.action(
          channel,
          `Color changed to ${color} (${colorName.name.value}) ████`
        );
    }
}