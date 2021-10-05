const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "continue",
        help: "The opposite of `pause`, makes the music play",
        usage: "mofo continue"
    },
    pt: {
      cmd: "continua",
        help: 'O oposto do "para", mete a música a dar',
        usage: "fdp continua",
    },

    async execute(message, _props) {

        const guild = getGuild(message.guild.id)

        message.reply(guild.language === "pt" ? "Ah afinal sempre querem música" : "Ah, so you do want music after all")
        guild.getPlayer().unpause()
    }
}