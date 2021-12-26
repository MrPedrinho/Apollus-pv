const {getGuild} = require("../assets");
const {video_info} = require("play-dl");
const {MessageEmbed} = require("discord.js");

module.exports = {
    pt: {
        cmd: "atual",
        help: "Informação da música atual",
        usage: "fdp atual"
    },
    en: {
        cmd: "playing",
        help: "Displays information about the music playing",
        usage: "mofo playing",
    },

    async execute (message, _props) {
        const guild = getGuild(message.guild.id)
        const lang = guild.language

        const queue = guild.getQueue()

        const current = queue[0]

        if (!current) return await message.reply(lang === "pt" ? "Não há música a tocar" : "No music playing")

        let song = await video_info(queue[0].url)
        song = song.video_details
        const date = new Date()

        const embed = new MessageEmbed({
            "title": lang === "pt" ? "Música Atual" : "Current Song",
            "description": `[${song.title}](${song.url})`,
            "color": 15158332,
            "timestamp": date,
            "footer": {
                "icon_url": current.author.displayAvatarURL(),
                "text": `${lang === "pt" ? "Música de" : "Song by"} ${current.author.username}#${current.author.discriminator}`
            },
            "thumbnail": {
                "url": song.thumbnails[0].url
            },
            "fields": [
                {
                    "name": lang === "pt" ? "Duração:" : "Duration:",
                    "value": song.durationRaw,
                    "inline": true
                },
                {
                    "name": lang === "pt" ? "Canal:" : "Channel:",
                    "value": `[${song.channel.name}](${song.channel.url})`,
                    "inline": true
                }
            ]
        })

        current.channel.send({embeds: [embed]})

    }
}