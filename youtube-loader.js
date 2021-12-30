const {video_info, yt_validate, search} = require("play-dl")
const {getGuild} = require("./assets")
const {MessageEmbed} = require("discord.js")

async function searchAndAdd(props, message, lang) {
    let video = await search(props.join(" "), {limit: 1})
    video = video[0]
    if (!video) return message.reply(lang === "pt" ? "Parabéns, conseguiste partir o bot. Impressionante, fds" : "Congrats, you managed to break the bot. Fucking impressive");
    return {
        title: video.title,
        url: video.url,
        duration: video.durationRaw,
        durationSec: video.durationInSec,
        thumbnail_url: video.thumbnails[0].url,
        author: message.author,
        channel: message.channel
    }

}

async function execute (message, props) {
    let song = {}

    const guild = getGuild(message.guild.id)
    const lang = guild.language

    let valid = yt_validate(props[0])

    if (valid === "video") {
        try {
            const {video_details} = await video_info(props[0])
            song = {
                title: video_details.title,
                url: video_details.url,
                duration: video_details.durationRaw,
                durationSec: parseInt(song.durationInSec),
                thumbnail_url: video_details.thumbnails[0].url,
                author: message.author,
                channel: message.channel,
            }
        } catch (err) {
            song = await searchAndAdd(props, message, lang)
        }

    } else if (valid === "playlist") {
        await guild.playPlaylist(message, props[0], [props[1]])
        return
    } else {
        try {
            song = await searchAndAdd(props, message, lang)
        } catch (err) {
            console.error(err)
        }
    }

    if (!song.url) {
        return message.reply(lang === "pt" ? "Ocorreu um erro, tenta outra vez" : "An error occured, try again")
    }

    const date = new Date()

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


    try {
        await guild.addToQueue(song)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {execute}