const {getConnection, cleanQueue} = require("../assets");

module.exports = {
    help: 'A música está-te a irritar? Mata o bot',

    async execute(message, _props) {
        try {
            message.reply("Okok")
            getConnection(message.guild.id).destroy()
            cleanQueue(message.guild.id)
        } catch (err) {
            throw (err)
        }
    }
}