
const {skipSong} = require("../assets")

module.exports = {
    help: 'Skips ilimitados, sem premium',

    async execute (message, _props) {

        try {
            await skipSong(message, message.guild.id)
        } catch (err) {
            console.log(err)
        }
    }
}