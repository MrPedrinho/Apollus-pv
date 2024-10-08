const {getGuild} = require("../assets");
const {video_info} = require("play-dl");

module.exports = {
    en: {
        cmd: "rick",
        help: "?",
        usage: "mofo rick"
    },
    pt: {
        cmd: "rick",
        help: "?",
        usage: "fdp rick",
    },

    async execute (message, _props) {
        const guild = getGuild(message.guild.id)

        const vc = message.member.voice.channel;
        if (!vc) return message.reply(guild.language === "pt" ? "Tens de estar num voice chat, cabrão" : "You need to be in a voice chat, fuckwit");

        await guild.setConnection(message, vc)

        try {
            message.channel.send({
                files: ["./rickroll-image.jpg"]
            })
        } catch {
            message.channel.send(`Never gonna give you up <@!${message.author.id}>`)
        }

        const {video_details} = await video_info("https://www.youtube.com/watch?v=dQw4w9WgXcQ",)

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