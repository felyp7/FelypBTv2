const  checkCooldown  = require('/home/ubuntu/BOT/BOTv2.js');
const got = require("got");
const fs = require("fs");

const cooldowns = {};

module.exports = {
    name: 'spotify',
    description: 'xD',
    cooldown: 5,
    async execute(client, channel, user, args) {
      const remainingCooldown = checkCooldown(user, this.name, this.cooldown * 1000);
        if (remainingCooldown !== null) {
            return;
        }
    const Updater = require("spotify-oauth-refresher");
      const api = new Updater({
        clientId: `${process.env.clientId}`,
        clientSecret: `${process.env.clientSecret}`,
      });

      api.setAccessToken(`${process.env.accessToken}`);
      api.setRefreshToken(`${process.env.refreshToken}`);

      const me = await api.request({
        url: "https://api.spotify.com/v1/me",
        method: "get",
        authType: "bearer",
      });

      console.log(me.config.headers.Authorization);
      console.log(me.id)
      let spotify_song = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${me.config.headers.Authorization} `,
        },
      };

      const request = require("request");
      request(
        `https://api.spotify.com/v1/me/player`,
        spotify_song,
        function (e, r) {
          if (e) {
            client.say(channel, `monkaS error`);
            console.log(`>> ERROR ${e}`);
          } else {
            if (r.body.length < 60) {
              client.action(channel, "Nothing is playing on Felyp8's spotify");
            } else {
              let dat = JSON.parse(r.body);
              let data = r;

              const format = require("format-duration");

              let test = data.body;

              //console.log(dat);
              console.log(r.body)
              const progress_ms = format(dat.progress_ms);
              const duration_ms = format(dat.item.duration_ms);
              const paused = dat.is_playing;

              if (dat.is_playing === false) {
                client.action(
                  channel,
                  "Nothing is playing on Felyp8's spotify"
                );
                return;
              }

              if (dat.item.is_local === true) {
                client.action(
                  channel,
                  `FELYP8 is currently playing ${dat.item.name} ▶ [${progress_ms}/${duration_ms}] (Local File)`
                );
                return;
              }

              let speakeremoji
              if (dat.device.volume_percent < 20) {
                speakeremoji = "🔈"
              } else 
              if (dat.device.volume_percent > 20 && dat.device.volume_percent < 60) {
                speakeremoji = "🔉"
              } else 
              {
                speakeremoji = "🔊" 
              }
              client.action(
                channel,
                `FELYP8 is currently playing ${dat.item.name} by ${(dat.item.artists.map(artist => artist.name)).join(", ")} ▶ [${progress_ms}/${duration_ms}] ${dat.item.external_urls.spotify} ${speakeremoji} ${dat.device.volume_percent}%`
              );
            }
          }
        }
      );
    }
}