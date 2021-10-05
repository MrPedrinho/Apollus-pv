const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "pause",
        help: "Pauses the music.",
        usage: "mofo pause"
    },
    pt: {
        cmd: "para",
        help: "Para a música",
        usage: "fdp para",
    },

    async execute(message, _props) {
        const guild = getGuild(message.guild.id)

        message.reply(guild.language === "pt" ? "Então querem ou não querem música? Decidam-se porra" : "Fuckin' hell. Do you want music or not?")
        guild.getPlayer().pause()
    }
}