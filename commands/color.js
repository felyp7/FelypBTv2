const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const  client  = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'color',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }
        let username = user.username;

        if (args[0]) {
          if (args[0].startsWith("@")) {
            args[0] = args[0].substring(1);
          }
          username = args[0];
        }
  
        const userCheck = await got(
          `https://api.ivr.fi/v2/twitch/user?login=${username}`,
          {
            responseType: "json",
            throwHttpErrors: false,
          }
        );



        if (!userCheck.body[0].id) {
          client.action(channel, `This user does not exist.`);
          return;
        }
  
        const userData = userCheck.body[0];
        const userColor = userData.chatColor;


        if (userColor === null) {
          client.action(channel, "Default. (never set)");
          return;
        }
  
        const colorName = await got(
          `https://www.thecolorapi.com/id?hex=${userColor.replace("#", "")}`
        ).json();
  
        await got(
          `https://api.twitch.tv/helix/chat/color?user_id=743355647&color=${encodeURIComponent(
            userColor
          )}`,
          {
            headers: {
              "Client-Id": process.env.NEW_client_id,
              Authorization: `Bearer ${process.env.NEW_access_token}`,
            },
            method: "PUT",
          },
          console.log("Changed to user color color")
        );
  
        setTimeout(() => {
          client.action(channel, `${userColor} (${colorName.name.value}) ████`);
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
              console.log("Changed back to own color")
            );
          }, 500);
        });
    }
}