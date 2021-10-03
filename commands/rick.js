const {setConnection, playNow} = require("../assets");
const {video_info} = require("play-dl");

module.exports = {
    help: "?",
    usage: "fdp rick",

    async execute (message, _props) {
        const vc = message.member.voice.channel;
        if (!vc) return message.reply("Tens de estar num voice chat, cabrão");

        await setConnection(message, vc)

        message.channel.send(`Never gonna give you up <@!${message.author.id}>`)

        const {video_details} = await video_info("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {cookie: process.env.COOKIES})

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