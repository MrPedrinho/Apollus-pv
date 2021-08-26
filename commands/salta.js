
const {skipSong} = require("../assets")

module.exports = {
    help: 'Skips ilimitados, sem premium',

    async execute (_message, _props) {
        await skipSong()
    }
}