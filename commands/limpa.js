const {resetQueue, player} = require("../assets");

module.exports = {
    help: "Limpa a playlist",

    async execute (message, _props) {
        message.reply("Okok")
        resetQueue()
        player.stop()
    }
}