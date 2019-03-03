const ytdl = require('ytdl-core')

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
    this.channel = null
    this.connection = null
    this.dispatcher = null
  }

  play (videoID) {
    // TODO: Stream options
    const stream = ytdl(videoID)
    this.dispatcher = this.connection.playStream(stream)
  }

  pause() {
    this.dispatcher.pause();
  }

  resume(){
    this.dispatcher.resume();
  }

  skip(){
    this.dispatcher.end();
  }

  isPlaying () {
    return this.connection !== null
  }

}

module.exports = VoiceHandler
