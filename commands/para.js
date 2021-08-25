const player = require("../assets.js").player

module.exports = {
    async execute(message, props) {
        player.pause()
    }
}