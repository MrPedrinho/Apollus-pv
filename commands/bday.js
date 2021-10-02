const {setConnection, playNow} = require("../assets");
const {video_info} = require("play-dl");

module.exports = {
    help: "Feliz Aniversário! Menciona o aniversariante para ser ainda melhor",

    async execute (message, _props) {
        const vc = message.member.voice.channel;
        if (!vc) return message.reply("Tens de estar num voice chat, cabrão");

        await setConnection(message, vc)

        if (message.mentions.members.first()) {
            message.channel.send(`Parabéns caralho!! <@!${message.mentions.members.first().id}>`)
        } else {
            message.reply("Quem é que faz anos caralho? Espero que haja bolo")
        }


        const {video_details} = await video_info("https://www.youtube.com/watch?v=5U5kmBT_WtA", {cookie: process.env.COOKIES})
        const song = {
            title: video_details.title,
            url: video_details.url,
            duration: video_details.durationRaw,
            thumbnail_url: video_details.thumbnail.url,
            author: message.author,
            channel: message.channel,
        }

        await playNow(message.guild.id, song)
    }
}