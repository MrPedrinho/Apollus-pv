const {playPrevious} = require("../assets");

module.exports = {
    help: "Mete a música anterior",
    async execute (message, _props) {
        const success = await playPrevious()
        if (!success) return message.reply("Nope")
        message.reply("Feito")
    }
}