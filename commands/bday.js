const {getGuild} = require("../assets");
const {video_info} = require("play-dl");

module.exports = {
    en: {
        cmd: "bday",
        help: "Happy Birthday!",
        usage: "mofo bday <@birthday boy/girl>"
    },
    pt: {
        cmd: "bday",
        help: "Feliz Aniversário!",
        usage: "fdp bday <@aniversariante (opcional)>",
    },

    async execute (message, _props) {
        const guild = getGuild(message.guild.id)
        const lang = guild.language

        const vc = message.member.voice.channel;
        if (!vc) return message.reply(lang === "pt" ? "Tens de estar num voice chat, cabrão" : "You need to be in a voice chat, fuckwit");

        await guild.setConnection(message, vc)

        if (message.mentions.members.first()) {
            message.channel.send(`${lang === "pt" ? "Parabéns caralho!!" : "Happy birthday asshole!"} <@!${message.mentions.members.first().id}>`)
        } else {
            message.reply(lang === "pt" ? "Quem é que faz anos caralho? Espero que haja bolo" : "Whose birthday is it? I hope there's cake")
        }


        const {video_details} = await video_info("https://www.youtube.com/watch?v=5U5kmBT_WtA")
        const song = {
            title: video_details.title,
            url: video_details.url,
            duration: video_details.durationRaw,
            thumbnail_url: video_details.thumbnails[0].url,
            author: message.author,
            channel: message.channel,
        }

        await guild.playNow(song)
    }
}