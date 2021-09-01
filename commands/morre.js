const {kill} = require("../assets");

module.exports = {
    help: 'A música está-te a irritar? Mata o bot',

    async execute(message, _props) {

        try {
            message.reply("Okok")
            await kill(message.guild.id)
        } catch (err) {
            throw (err)
        }
    }
}