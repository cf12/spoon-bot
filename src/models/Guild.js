const VoiceHandler = require('./VoiceHandler')

class Guild {
  constructor () {
    this.voiceHandler = new VoiceHandler()
  }
}

module.exports = Guild