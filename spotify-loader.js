const play = require("play-dl")
const {is_expired, refreshToken, sp_validate, spotify} = require("play-dl")
const {getGuild} = require("./assets")
const {MessageEmbed} = require("discord.js")

async function getSong(title, message) {
    let searched = await play.search(title, { limit : 1 })
    searched = searched[0]

    return {
        title: searched.title,
        url: searched.url,
        duration: searched.durationRaw,
        durationSec: parseInt(searched.durationInSec),
        thumbnail_url: searched.thumbnail.url,
        author: message.author,
        channel: message.channel
    }
}

async function execute (message, props) {

    const guild = getGuild(message.guild.id)
    const lang = guild.language

    if(is_expired()){
        await refreshToken()
    }

    let valid = sp_validate(props[0])
    const date = new Date()

    if (valid === "track") {
        const track = await spotify(props[0])

        const song = await getSong(`${track.name} ${track.artists.map(artist => artist.name + " ")}`, message)

        const embed = new MessageEmbed({
            "title": lang === "pt" ? "Nova música adicionada" : "New song added",
            "color": 15158332,
            "timestamp": date,
            "description": `
                [${song.title}](${song.url})
                **${lang === "pt" ? "Duração" : "Length"}** - [${song.duration}](${song.url})
            `,
            "thumbnail": {
                "url": song.thumbnail_url
            },
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `${lang === "pt" ? "Música de" : "Song by"} ${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})

        await guild.addToQueue(song)
    } else if (valid === "playlist" || valid === "album") {
        let data = await spotify(props[0])

        let converted = []
        let progress = 0

        let confirmMessage = await message.channel.send(`${lang === "pt" ? "Estou a procurar as músicas" : "Searching the songs"} - ${progress}/${data.tracksCount || data.trackCount}`)

        for (const v of data.page(1)) {
            const song = await getSong(`${v.name} ${v.artists.map(artist => artist.name + " ")}`, message)

            converted.push(song)

            progress++
            if (progress === data.tracksCount) {
                await confirmMessage.delete()
                confirmMessage = undefined
            } else {
                await confirmMessage.edit(`${lang === "pt" ? "Estou a procurar as músicas" : "Searching the songs"}- ${progress}/${data.tracksCount || data.trackCount}`)
            }
        }


        if (props[1]?.toLowerCase() !== "noshuffle") {
            guild.shuffleArray(converted)
        }

        const embed = new MessageEmbed({
            "title": lang === "pt" ? "Playlist adicionada" : "Playlist added",
            "color": 15158332,
            "timestamp": date,
            "description":`
                [${data.name}](${data.url})
                **${lang === "pt" ? "Nº de Músicas" : "Number of songs"}**: ${data.tracksCount || data.trackCount}
            `,
            "thumbnail": {
                "url": data.thumbnail.url
            },
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `${lang === "pt" ? "Playlist colocada por" : "Playlist by"} ${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})

        for (const v of converted) {
            await guild.addToQueue(v);
        }
    } else {
        await require("./youtube-loader").execute(message, props)
    }
}

module.exports = {execute}