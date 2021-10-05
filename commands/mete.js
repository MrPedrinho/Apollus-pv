const {getGuild} = require("../assets");
const {sp_validate} = require("play-dl");

module.exports = {
    en: {
        cmd: "add",
        help: "Adds a song to the queue. Supports Youtube search and playlists; and Spotify albums, tracks, and playlists.",
        usage: "mofo add <search query or URL>"
    },
    pt: {
        cmd: "mete",
        help: "Adiciona uma música à playlist. Suporta pesquisa e playlists do Youtube; e albums, músicas e playlists do Spotify.",
        usage: "fdp mete <pesquisa ou URL>",
    },


    async execute(message, props) {

        const guild = getGuild(message.guild.id)
        const lang = guild.language

        const vc = message.member.voice.channel;

        if (!vc) return message.reply(lang === "pt" ? "Tens de estar num voice chat, cabrão" : "You need to be in a voice chat, fuckwit");

        if (!props.length) return message.reply(lang === "pt" ? "Tens de dizer uma música, corno" : "You need to give a music, bitch");

        await guild.setConnection(message, vc)

        let spotify = sp_validate(props[0])

        if (spotify) {
            await require("../spotify-loader").execute(message, props)
            return
        }

        await require("../youtube-loader").execute(message, props)

    },
};