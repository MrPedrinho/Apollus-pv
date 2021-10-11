const {getGuild} = require("../assets");
const {MessageEmbed} = require("discord.js");

module.exports = {
    en: {
        cmd: "info",
        help: "Information about the bot",
        usage: "mofo info"
    },
    pt: {
        cmd: "info",
        help: "Informação sobre o bot",
        usage: "fdp info",
    },

    async execute (message, _props) {

        const guild = getGuild(message.guild.id)
        const lang = guild.language

        const date = new Date()

        const embed = new MessageEmbed({
            "title": lang === "pt" ? "Informação sobre o bot" : "Information about the bot",
            "color": 15158332,
            "timestamp": date,
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `${lang === "pt" ? "Pedido por" : "Requested by"} ${message.author.username}#${message.author.discriminator}`
            },
            "fields": [
                {
                    "name": lang === "pt" ? "Desenvoldido por" : "Developed by",
                    "value": "Bob.#7752",
                    "inline": true
                }, {
                    "name": lang === "pt" ? "Versão" : "Version",
                    "value": "2.4.3",
                    "inline": true
                }
            ]
        })

        message.channel.send({embeds: [embed]})

    }
}