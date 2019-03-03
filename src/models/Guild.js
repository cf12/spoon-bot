const VoiceHandler = require('./VoiceHandler')

class Guild {
  constructor (socket) {
    this.voiceHandler = new VoiceHandler(socket)
  }
}

module.exports = Guild