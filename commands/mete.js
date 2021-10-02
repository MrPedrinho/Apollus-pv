const youtube = require('play-dl')
const {video_info, yt_validate} = require("play-dl");
const {addToQueue, setConnection, playPlaylist} = require("../assets")
const {MessageEmbed} = require("discord.js");

module.exports = {
    help: 'Adiciona uma música à playlist. Se colocares o link de uma playlist, podes meter `noshuffle` no fim para não dar shuffle à playlist',

    async execute(message, props) {

        const vc = message.member.voice.channel;

        if (!vc) return message.reply("Tens de estar num voice chat, cabrão");

        if (!props.length) return message.reply("Tens de dizer uma música, corno");

        let song = {}

        let valid = yt_validate(props[0])

        await setConnection(message, vc)
        if (valid === "video") {
            try {
                const {video_details} = await video_info(props[0], {cookie: process.env.COOKIES})
                song = {
                    title: video_details.title,
                    url: video_details.url,
                    duration: video_details.durationRaw,
                    thumbnail_url: video_details.thumbnail.url,
                    author: message.author,
                    channel: message.channel,
                }
            } catch (err) {
                console.log(err)
            }

        } else if (valid === "playlist") {
            await setConnection(message, vc)
            await playPlaylist(message.guild.id, message,props[0], [props[1]])
            return
        } else {

            try {
                let video = await youtube.search(props.join(" "), {limit: 1})
                if (!video) return message.reply("Parabéns, conseguiste partir o bot. Impressionante, fds");

                video = video[0]
                song = {
                    title: video.title,
                    url: video.url,
                    duration: video.durationRaw,
                    thumbnail_url: video.thumbnail.url,
                    author: message.author,
                    channel: message.channel
                }
            } catch (err) {
                console.error(err)
            }

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

        try {
            await addToQueue(song)
        } catch (err) {
            console.log(err)
        }
    },
};