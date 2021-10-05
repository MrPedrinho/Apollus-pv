const {getGuild} = require("../assets");

module.exports = {
    pt: {
        cmd: "anterior",
        help: "Mete a música anterior",
        usage: "fdp anterior"
    },
    en: {
        cmd: "previous",
        help: "Play the previous music",
        usage: "mofo previous"
    },

    async execute (message, _props) {
        const guild = getGuild(message.guild.id)
        const lang = guild.language

        try {
            const success = guild.playPrevious()
            if (!success) return message.reply(lang === "pt" ? "Tentei, mas não deu" : "I tried, but I failed")
            message.reply(lang === "pt" ? "Feito" : "Done")
        } catch (err) {
            console.log(err)
        }
    }
}