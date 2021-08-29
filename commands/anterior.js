const {playPrevious} = require("../assets");

module.exports = {
    help: "Mete a música anterior",
    async execute (message, _props) {
        try {
            const success = await playPrevious()
            if (!success) return message.reply("Tentei, mas não deu")
            message.reply("Feito")
        } catch (err) {
            console.log(err)
        }
    }
}