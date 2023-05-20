const { checkCooldown } = require('/home/ubuntu/BOT/BOTv2.js');
const { client } = require('/home/ubuntu/BOT/BOTv2.js')
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'randomquote',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
        const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        categories = [
            "age",
            "alone",
            "amazing",
            "anger",
            "architecture",
            "art",
            "attitude",
            "beauty",
            "best",
            "birthday",
            "business",
            "car",
            "change",
            "communications",
            "computers",
            "cool",
            "courage",
            "dad",
            "dating",
            "death",
            "design",
            "dreams",
            "education",
            "environmental",
            "equality",
            "experience",
            "failure",
            "faith",
            "family",
            "famous",
            "fear",
            "fitness",
            "food",
            "forgiveness",
            "freedom",
            "friendship",
            "funny",
            "future",
            "god",
            "good",
            "government",
            "graduation",
            "great",
            "happiness",
            "health",
            "history",
            "home",
            "hope",
            "humor",
            "imagination",
            "inspirational",
            "intelligence",
            "jealousy",
            "knowledge",
            "leadership",
            "learning",
            "legal",
            "life",
            "love",
            "marriage",
            "medical",
            "men",
            "mom",
            "money",
            "morning",
            "movies",
            "success",
          ];
          const request = require("request");
          randomindex = Math.floor(Math.random() * categories.length);
          request.get(
            {
              url:
                "https://api.api-ninjas.com/v1/quotes?category=" +
                categories[randomindex],
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
                `(${data[0].category}) ${data[0].author} - ${data[0].quote}`
              );
            }
          );
    }
}