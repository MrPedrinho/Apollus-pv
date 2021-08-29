const youtube = require('play-dl')
const {video_info} = require("play-dl");

const {addToQueue, setConnection} = require("../assets")
const {MessageEmbed} = require("discord.js");

module.exports = {
    help: 'Adiciona uma música à playlist',

    async execute(message, props) {
        const vc = message.member.voice.channel;

        if (!vc) return message.reply("Tens de estar num voice chat, cabrão");

        if (!props.length) return message.reply("Tens de dizer uma música, corno");

        let song = {}

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;

        if (props[0].match(regExp)) {

            try {
                const {video_details} = await video_info(props[0])
                song = {
                    title: video_details.title,
                    url: video_details.url,
                    duration: video_details.durationRaw,
                    thumbnail_url: video_details.thumbnail.url,
                    author: message.author,
                    channel: message.channel
                }
            } catch (err) {
                console.log(err)
            }

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
            await setConnection(message, vc)
            await addToQueue(song)
        } catch (err) {
            console.log(err)
        }
    },
};