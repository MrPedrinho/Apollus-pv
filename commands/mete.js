const youtube = require('play-dl')
const {video_info} = require("play-dl");

const {addToQueue, setConnection, getQueue} = require("../assets")
const {MessageEmbed} = require("discord.js");
const {Embed} = require("@discordjs/builders");

module.exports = {
    async execute(message, props) {
        const vc = message.member.voice.channel;

        if (!vc) return;

        if (!props.length) return;

        let song = {}

        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

        if (props[0].match(regExp)) {
            const {video_details} = await video_info(props[0])

            song = {
                title: video_details.title,
                url: video_details.url,
                duration: video_details.durationRaw,
                thumbnail_url: video_details.thumbnail.url,
                author: message.author,
                channel: message.channel
            }
        } else {

            try {
                let video = await youtube.search(props.join(" "), {limit: 1})
                if (!video) return;

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
                "text": `Colocada por ${message.author.username}#${message.author.discriminator}`
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