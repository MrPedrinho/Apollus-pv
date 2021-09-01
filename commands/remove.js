const {removeSong} = require("../assets");
const {MessageEmbed} = require("discord.js");

module.exports = {
    help: "Remove uma música da playlist",

    async execute (message, props) {

        const removedSong = removeSong(props.join(" "), message.guild.id)
        if (!removedSong) {
            return message.reply("Não encontrei nada")
        }
        const date = new Date()

        const embed = new MessageEmbed({
            "title": "Já está, descança",
            "color": 15158332,
            "timestamp": date,
            "description": `
                Canção removida\n
                [${removedSong.title}](${removedSong.url})
            `,
            "thumbnail": {
                "url": removedSong.thumbnail_url
            },
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `Música de ${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})
    }
}