const player = require("../assets.js").player

module.exports = {
    help: 'Para a música',

    async execute(message, _props) {
        message.reply("Então querem ou não querem música? Decidam-se porra")
        player.pause()
    }
}