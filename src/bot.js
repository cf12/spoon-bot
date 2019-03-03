const Discord = require("discord.js");
const speech = require('@google-cloud/speech');
const record = require('node-record-lpcm16')

const client = new Discord.Client();
const Guild = require("./models/Guild");
const Youtube = require('./models/Youtube');

const config = require("../config/config.json");
const yt = new Youtube(config.ytkey)
const pf = config.prefix;

const speechClient = new speech.SpeechClient()

let guilds = new Map()
guilds.set(config.guildID, new Guild())

const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  },
  interimResults: false
};

const recognizeStream = speechClient
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data => {
    const msg = data.results[0].alternatives[0].transcript.trim().toUpperCase().split(' ')
    console.log(msg)
    const guild = guilds.get(config.guildID)

    if (!guild.voiceHandler.isPlaying()) return

    const command = msg[0].toUpperCase()
    const args = msg.slice(1)

    if (command === 'PLAY') {
      const vHandler = guild.voiceHandler
      console.log(args.join(' '))
      yt.search(args.join(' '), 1)
        .then(data => {
          id = data.items[0].id.videoId
          vHandler.play(id)
        })
    } else if (command === 'LEAVE') {
      vHandler.leave();
    } else if (command === 'PAUSE') {
      vHandler.pause();
    } else if (command === 'RESUME' ) {
      vHandler.resume();
    } else if (command === 'SKIP') {

    }
  })

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

    record
    .start({
      sampleRateHertz: 16000,
      threshold: 0,
      // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
      verbose: false,
      recordProgram: 'rec', // Try also "arecord" or "sox"
      silence: '0.1',
    })
    .on('error', console.error)
    .pipe(recognizeStream);
  }
})

// message.channel.send({embed: {
//   link: String('http://youtube.com/watch?v=' + videoID),
//   requester: member.toString(),
//   title: String(video.snippet.title),
//   description: "Music Brought to You by Brian's Bimbos Foundation",

// }
// });

