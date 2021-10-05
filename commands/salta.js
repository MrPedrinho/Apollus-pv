
const {getGuild} = require("../assets")

module.exports = {
    en: {
        cmd: "skip",
        help: "Unlimited skips, for free.",
        usage: "mofo skip"
    },
    pt: {
        cmd: "salta",
        help: "Skips ilimitados, sem premium",
        usage: "fdp salta",
    },

    async execute (message, _props) {

        try {
            await getGuild(message.guild.id).skipSong(message)
        } catch (err) {
            console.log(err)
        }
    }
}