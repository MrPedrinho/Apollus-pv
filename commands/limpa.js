const {resetQueue, getPlayer} = require("../assets");

module.exports = {
    help: "Limpa a playlist",

    async execute (message, _props) {
        message.reply("Okok")
        resetQueue(message.guild.id)
        getPlayer(message.guild.id).stop()
    }
}