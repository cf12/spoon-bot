const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("../config/config.json");
const pf = config.prefix;
const ytdl = require('ytdl-core');
const Guild = require("./models/Guild");
const Youtube = require('./models/Youtube');
const speech = require('@google-cloud/speech');

//Is this require for speech?
const fs = require('fs');

const yt = new Youtube(config.ytkey)

let guilds = new Map();

client.login(config.token);
client.on("ready", () => {
  console.log("[INFO] > Bot started!");
});

client.on("message", msg => {
  const guildID = msg.guild.id
  if (!guilds.has(guildID)) {
    guilds.set(guildID, new Guild())
  }

  const guild = guilds.get(guildID)
  const vHandler = guild.voiceHandler

  const rawArgs = msg.content.split(' ')
  const command = rawArgs[0].slice(pf.length).toUpperCase()
  const args = rawArgs.slice(1)

  if (command === "JOIN") {
    const channel = msg.member.voiceChannel;

    if (!channel) return console.error("Channel does not exist");

    vHandler.join(channel);

  }

  if(command === "SEARCH"){

    const query = args.join(' ')

    yt.search(query, 1)
      .then(data => {
        id = data.items[0].id.videoId

        vHandler.play(id)
      })

    // let videoId
    // yt.getVideo(id)
    //   .then(data =>{

    //     //what is this
    //     videoID = data.options.url


    //   })
    }

  if (command === "LEAVE") {
    vHandler.leave();
  }

  if(command === "PAUSE") {
    vHandler.pause();
  }

  if(command === "RESUME" ){
    vHandler.resume();
  }

  if(command === "SKIP"){
    vHandler.skip();
  }




})
