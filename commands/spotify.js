const play = require("play-dl")
const {is_expired, refreshToken, spotify, sp_validate} = require("play-dl")
const {setConnection, addToQueue, cleanQueue} = require("../assets");
const {MessageEmbed} = require("discord.js");

module.exports = {
    help: "Mete músicas ou playlists do Spotify, tem de ser com URL. Se for playlist ou album, podes adicionar `noshuffle` no fim para não dar shuffle",

    async execute (message, props) {

        const vc = message.member.voice.channel;

        if (!vc) return message.reply("Tens de estar num voice chat, cabrão");

        if (!props.length) return message.reply("Tens de dizer uma música, corno");

        if(is_expired()){
            console.log("gg")
            await refreshToken()
        }

        let valid = sp_validate(props[0])

        await setConnection(message, vc)
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

            const date = new Date()

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

            await setConnection(message, vc)
            await addToQueue(song)
        } else if (valid === "playlist" || valid === "album") {
            let data = await spotify(props[0])

            console.log(data)

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

            function shuffleArray(array) {
                for (var i = array.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }

            if (props[1]?.toLowerCase() !== "noshuffle") {
                shuffleArray(converted)
            }

            const date = new Date()

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


            cleanQueue(message.guild.id)

            converted.forEach(v => addToQueue(v))
        }
    }
}