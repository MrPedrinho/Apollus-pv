
const {skipSong} = require("../assets")

module.exports = {
    async execute () {
        await skipSong()
    }
}