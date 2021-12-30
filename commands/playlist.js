const {getGuild} = require("../assets");
const {MessageEmbed} = require("discord.js");

module.exports = {
    en: {
        cmd: "queue",
        help: "Displays the song queue",
        usage: "mofo queue"
    },
    pt: {
        cmd: "playlist",
        help: "Mostra a playlist atual",
        usage: "fdp playlist",
    },

    async execute (message, _props) {
        const guild = getGuild(message.guild.id)
        const lang = guild.language

        const queue = guild.getQueue()
        const spliced = queue.length > 10

        let durationAcc = 0;

        const nQueue = queue.slice(0, 10).map((song, idx) => {
            let computedDuration = `${Math.floor(durationAcc/60).toString()}:${durationAcc%60 < 10 ? (durationAcc%60).toString() + "0" : (durationAcc%60).toString()}`
            durationAcc += song.durationSec
            if (idx > 0) return `${idx} - [${song.title}](${song.url}) - **${song.duration}** (${lang === "pt" ? `aproximadamente ${computedDuration} até tocar`: `approximately ${computedDuration} until it plays`})\n`
            return `
                ⬐ ${lang === "pt" ? "Música atual, ganda fixe}" : "Current music, much wow"}
                ${lang === "pt" ? "Agora" : "Now"} - [${song.title}](${song.url}) - **${song.duration}**
                ⬑\n`
        })

        nQueue.push(nQueue.length === 0 ?
            lang === "pt" ? "Vazio, como o teu crânio" : "Empty, like your brain"
            : spliced ?
                lang === "pt" ? "Ainda há mais músicas, mas calma aí que ainda falta algum tempo": "There are more songs, but it'll take a while for them to play"
                : lang === "pt" ? "Acaba aqui" : "It ends here"
        )

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