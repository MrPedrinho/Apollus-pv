
const {skipSong} = require("../assets")

module.exports = {
    help: 'Skips ilimitados, sem premium',

    async execute (message, _props) {
        await skipSong(message)
    }
}