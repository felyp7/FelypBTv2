const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'weather',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
      if (remainingCooldown !== null) {
          return;
      }        const weather = require("openweather-apis");
      const Compass = require("cardinal-direction");
      const hdate = require("human-date");
      const moment = require("moment");
      const kelvinToCelsius = require("kelvin-to-celsius");

      weather.setLang("en");

      weather.setCity(`${args.join(" ")}`);

      weather.setUnits("metric");

      weather.setAPPID(process.env.weather_api_token);

      const data = await got(
        `https://api.openweathermap.org/data/2.5/weather?q=${args.join(
          " "
        )}&APPID=${process.env.weather_api_token}`,
        {
          responseType: "json",
          throwHttpErrors: false,
        }
      );

      let JSONObj = data.body;
      console.log(JSONObj);

      if (JSONObj.cod == 400) {
        client.action(channel, "No city found :)");
        return;
      }

      if (JSONObj.cod == 429) {
        client.action(channel, "No city found :)");
        return;
      }

      if (JSONObj.cod == 500) {
        client.action(channel, "No city found :)");
        return;
      }

      if (JSONObj.cod == 502) {
        client.action(channel, "No city found :)");
        return;
      }

      if (JSONObj.cod == 503) {
        client.action(channel, "No city found :)");
        return;
      }

      if (JSONObj.cod == 504) {
        client.action(channel, "No city found :)");
        return;
      }

      if (JSONObj.cod == 404) {
        client.action(channel, "No city found :)");
        return;
      }

      const direction = Compass.cardinalFromDegree(JSONObj.wind.deg);

      let unix_timestamp = JSONObj.sys.sunrise;

      var locationTime = new Date(unix_timestamp * 1000);
      var currentTime = Date.now();
      var SunRiseTime = locationTime - currentTime;

      var date = new Date(SunRiseTime);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();

      var SunRise = hours + "h" + minutes.substr(-2) + "m";

      let unix_timestamp2 = JSONObj.sys.sunset;

      var locationTime2 = new Date(unix_timestamp2 * 1000);
      var currentTime2 = Date.now();
      var SunSetTime = locationTime2 - currentTime2;

      var date2 = new Date(SunSetTime);
      var hours2 = date2.getHours();
      var minutes2 = "0" + date2.getMinutes();
      var seconds2 = "0" + date2.getSeconds();

      var SunSet = hours2 + "h" + minutes2.substr(-2) + "m";

      if (JSONObj.wind.gust == null) {
        client.action(
          channel,
          `${JSONObj.name}, ${JSONObj.sys.country}: ${kelvinToCelsius(
            JSONObj.main.temp
          )}°C, feels like ${kelvinToCelsius(
            JSONObj.main.feels_like
          )}°C. Weather: ${
            JSONObj.weather[0].description
          }. ${direction} Wind speed: ${JSONObj.wind.speed} m/s. Humidity: ${
            JSONObj.main.humidity
          }%. Air pressure: ${
            JSONObj.main.pressure
          } hPa. Sun rises in ${SunRise}, sunset in ${SunSet}.  `
        );
        return;
      }

      client.action(
        channel,
        `${JSONObj.name}, ${JSONObj.sys.country}: ${kelvinToCelsius(
          JSONObj.main.temp
        )}°C, feels like ${kelvinToCelsius(
          JSONObj.main.feels_like
        )}°C. Weather: ${
          JSONObj.weather[0].description
        }. ${direction} Wind speed: ${
          JSONObj.wind.speed
        } m/s. Wind gusts up to ${JSONObj.wind.gust} m/s. Humidity: ${
          JSONObj.main.humidity
        }%. Air pressure: ${
          JSONObj.main.pressure
        } hPa. Sun rises in ${SunRise}, sunset in ${SunSet}.  `
      );
    }
}