const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "clear",
        help: "Clears the queue",
        usage: "mofo clear"
    },
    pt: {
        cmd: "limpa",
        help: "Limpa a playlist",
        usage: "fdp limpa",
    },

    async execute (message, _props) {

        const guild = getGuild(message.guild.id)

        message.reply("Okok")
        guild.cleanQueue()
    }
}