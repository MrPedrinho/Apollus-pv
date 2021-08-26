const player = require("../assets.js").player

module.exports = {
    help: 'O oposto do "para", mete a música a dar',

    async execute(message, _props) {
        message.reply("Ah afinal sempre querem música")
        player.unpause()
    }
}