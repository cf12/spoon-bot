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
  }

  play (videoID) {
    // TODO: Stream options
    const stream = ytdl(videoID)
    this.dispatcher = this.connection.playStream(stream)
    const receiver = this.dispatcherconnection.createReceiver();
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

}

module.exports = VoiceHandler
