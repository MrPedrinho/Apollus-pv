const {setConnection} = require("../assets");
const {sp_validate} = require("play-dl");

module.exports = {
    help: " Aceita URLs do youtube e spotify, se for uma playlist podes meter `noshuffle` no fim para não dar shuffle",
    usage: "fdp mete <música | url>",

    async execute(message, props) {

        const vc = message.member.voice.channel;

        if (!vc) return message.reply("Tens de estar num voice chat, cabrão");

        if (!props.length) return message.reply("Tens de dizer uma música, corno");

        await setConnection(message, vc)

        let spotify = sp_validate(props[0])

        if (spotify) {
            await require("../spotify-loader").execute(message, props)
            return
        }

        await require("../youtube-loader").execute(message, props)

    },
};