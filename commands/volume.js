const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "volume",
        help: "Changes the volume of the bot",
        usage: "mofo volume <value>"
    },
    pt: {
        cmd: "volume",
        help: "Altera o volume do bot",
        usage: "fdp volume <value>",
    },

    async execute (message, props) {
        const date = new Date()
        const guild = getGuild(message.guild.id)
        const {language} = guild

        const volume = props[0]
        if (volume >= 0.1 && volume <= 2) {
            guild.setVolume(volume)
            message.reply(language === "pt" ? "É para já" : "Comin' right up")
            return
        }
        message.reply(language === "pt" ? "Tem de ser um valor entre 0.1 e 2, inclusive" : "Must be a value between 0.1 and 2, inclusive")
    }
}