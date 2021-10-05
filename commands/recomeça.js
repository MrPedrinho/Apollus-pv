const {getGuild} = require("../assets");
module.exports = {
    en: {
        cmd: "restart",
        help: "Restarts the current song.",
        usage: "mofo restart"
    },
    pt: {
        cmd: "recomeça",
        help: "Recomeça a música atual.",
        usage: "fdp recomeça",
    },

    async execute (message, _props) {

        message.reply(getGuild(message.guild.id).language === "pt" ? "Feito, chefe" : "Aye Sir!")
        await getGuild(message.guild.id).restartSong(message.guild.id)
    }
}