const {getPlayer} = require("../assets");

module.exports = {
    help: 'Para a música',

    async execute(message, _props) {
        message.reply("Então querem ou não querem música? Decidam-se porra")
        getPlayer(message.guild.id).pause()
    }
}