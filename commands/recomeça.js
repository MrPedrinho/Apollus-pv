const {restartSong} = require("../assets");
module.exports = {
    help: "Recomeça a música",
    async execute (message, _props) {
        message.reply("Feito, chefe")
        await restartSong(message.guild.id)
    }
}