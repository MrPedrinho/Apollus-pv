const {getGuild} = require("../assets");

module.exports = {
    help: "Atreve-te",
    usage: "fdp ping",

    en: {
        cmd: "ping",
        help: "I dare you to do it",
        usage: "mofo ping"
    },
    pt: {
        cmd: "ping",
        help: "Atreve-te",
        usage: "fdp ping",
    },

    async execute(message, _props) {
        const lang = getGuild(message.guild.id).language

        try {
            await message.reply(lang === "pt" ? "Ping o quê ò filho da puta" : "Ping what? Fucking asshole")
        } catch (err) {
            console.log(err)
        }
    },
};