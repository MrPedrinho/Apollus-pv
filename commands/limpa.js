const {cleanQueue} = require("../assets");

module.exports = {
    help: "Limpa a playlist",
    usage: "fdp limpa",

    async execute (message, _props) {

        message.reply("Okok")
        cleanQueue(message.guild.id)
    }
}