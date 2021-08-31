const {cleanQueue} = require("../assets");

module.exports = {
    help: "Limpa a playlist",

    async execute (message, _props) {
        message.reply("Okok")
        cleanQueue(message.guild.id)
    }
}