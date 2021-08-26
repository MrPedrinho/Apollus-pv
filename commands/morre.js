const {getConnection} = require("../assets");

module.exports = {
    help: 'A música está-te a irritar? Mata o bot',

    async execute(_message, _props) {
        const connection = getConnection()

        connection.destroy()
    }
}