const {getQueue} = require("../assets");
const {video_info} = require("play-dl");
const {MessageEmbed} = require("discord.js");

module.exports = {
    help: "Informação da música atual",
    usage: "fdp atual",
    async execute (message, _props) {
        const queue = getQueue(message.guild.id)

        const current = queue[0]
        let song = await video_info(queue[0].url)
        song = song.video_details
        const date = new Date()

        const embed = new MessageEmbed({
            "title": "Música Atual",
            "description": `[${song.title}](${song.url})`,
            "color": 15158332,
            "timestamp": date,
            "footer": {
                "icon_url": current.author.displayAvatarURL(),
                "text": `Música de ${current.author.username}#${current.author.discriminator}`
            },
            "thumbnail": {
                "url": song.thumbnail.url
            },
            "fields": [
                {
                    "name": "Duração:",
                    "value": song.durationRaw,
                    "inline": true
                },
                {
                    "name": "Canal:",
                    "value": `[${song.channel.name}](${song.channel.url})`,
                    "inline": true
                }
            ]
        })

        current.channel.send({embeds: [embed]})

    }
}