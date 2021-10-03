const {getPlayer} = require("../assets");
module.exports = {
    help: 'O oposto do "para", mete a música a dar',
    usage: "fdp continua",

    async execute(message, _props) {

        message.reply("Ah afinal sempre querem música")
        getPlayer(message.guild.id).unpause()
    }
}