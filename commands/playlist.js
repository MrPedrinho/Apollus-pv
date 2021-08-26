const {getQueue} = require("../assets");
const {MessageEmbed} = require("discord.js");

module.exports = {
    help: 'Playlist...',

    async execute (message, _props) {
        const queue = getQueue()
        const spliced = queue.length > 10

        const nQueue = queue.slice(0, 10).map((song, idx) => {
            if (idx > 0) return `${idx + 1} - [${song.title}](${song.url}) - **${song.duration}**\n`
            return `
                ⬐ Música atual, ganda fixe
                ${idx + 1} - [${song.title}](${song.url}) - **${song.duration}**
                ⬑\n`
        })

        nQueue.push(spliced ? "Ainda há mais músicas, mas calma aí que ainda falta" : `Acaba aqui`)

        const date = new Date()

        const embed = new MessageEmbed({
            "title": "Playlist",
            "color": 15158332,
            "timestamp": date,
            "description": nQueue.join("\n"),
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})
    }
}