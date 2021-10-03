const play = require("play-dl")
const {is_expired, refreshToken, sp_validate, spotify} = require("play-dl")
const {addToQueue, shuffleArray} = require("./assets")
const {MessageEmbed} = require("discord.js")

async function execute (message, props) {

    if(is_expired()){
        await refreshToken()
    }

    let valid = sp_validate(props[0])
    const date = new Date()

    if (valid === "track") {
        const track = await spotify(props[0])

        let searched = await play.search(`${track.name}`, { limit : 1 })
        searched = searched[0]

        const song = {
            title: searched.title,
            url: searched.url,
            duration: searched.durationRaw,
            thumbnail_url: searched.thumbnail.url,
            author: message.author,
            channel: message.channel
        }


        const embed = new MessageEmbed({
            "title": "Nova música adicionada",
            "color": 15158332,
            "timestamp": date,
            "description": `
                [${song.title}](${song.url})
                **Duração** - [${song.duration}](${song.url})
            `,
            "thumbnail": {
                "url": song.thumbnail_url
            },
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `Música de ${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})

        await addToQueue(song)
    } else if (valid === "playlist" || valid === "album") {
        let data = await spotify(props[0])

        let converted = []
        let progress = 0

        let confirmMessage = await message.channel.send(`Estou a procurar as músicas - ${progress}/${data.tracksCount || data.trackCount}`)

        for (const v of data.page(1)) {
            let song = await play.search(`${v.name}`, {limit: 1})
            song = song[0]

            const convertedSong = {
                title: song.title,
                url: song.url,
                duration: song.durationRaw,
                thumbnail_url: song.thumbnail.url,
                author: message.author,
                channel: message.channel
            }

            converted.push(convertedSong)

            progress++
            if (progress === data.tracksCount) {
                await confirmMessage.delete()
                confirmMessage = undefined
            } else {
                await confirmMessage.edit(`Estou a procurar as músicas - ${progress}/${data.tracksCount || data.trackCount}`)
            }
        }


        if (props[1]?.toLowerCase() !== "noshuffle") {
            shuffleArray(converted)
        }

        const embed = new MessageEmbed({
            "title": "Playlist adicionada",
            "color": 15158332,
            "timestamp": date,
            "description":`
                [${data.name}](${data.url})
                **Nº de Músicas**: ${data.tracksCount || data.trackCount}
            `,
            "thumbnail": {
                "url": data.thumbnail.url
            },
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `Playlist colocada por ${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})

        for (const v of converted) {
            await addToQueue(v);
        }
    } else {
        await require("youtube-loader").execute(message, props)
    }
}

module.exports = {execute}