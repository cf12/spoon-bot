class VoiceHandler {
  constructor () {
    this.channel = null
    this.connection = null
    this.dispatcher = null
  }

  join (channel) {
    channel.join()
      .then(connection => {
        console.log("[INFO] > Joined voice channel")
        this.connection = connection
      })
      .catch(e => {
        console.error(e)
      })
  }

  leave () {
    this.connection.disconnect()
  }

  play () {

    const ytdl = require('ytdl-core');

    this.connection.play(ytdl(
      'the link or something idk'
    ));

  }
}

module.exports = VoiceHandler
