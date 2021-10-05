const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "die",
        help: "The music is annoying you? Kill the bot!",
        usage: "mofo die"
    },
    pt: {
        cmd: "morre",
        help: "A música está-te a irritar? Mata o bot",
        usage: "fdp morre",
    },

    async execute(message, _props) {

        const guild = getGuild(message.guild.id)

        try {
            message.reply("Okok")
            await guild.kill()
        } catch (err) {
            throw (err)
        }
    }
}