const {getConnection, resetQueue} = require("../assets");

module.exports = {
    help: 'A música está-te a irritar? Mata o bot',

    async execute(message, _props) {
        const connection = getConnection()

        message.reply("Okok")
        connection.destroy()
        resetQueue()
    }
}