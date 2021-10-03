const {kill} = require("../assets");

module.exports = {
    help: 'A música está-te a irritar? Mata o bot',
    usage: "fdp morre",

    async execute(message, _props) {

        try {
            message.reply("Okok")
            await kill(message.guild.id)
        } catch (err) {
            throw (err)
        }
    }
}