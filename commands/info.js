const {getGuild} = require("../assets");
const {MessageEmbed} = require("discord.js");
const {guilds} = require("../index");

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
        const pack = require("../package.json")
        const version = pack.version
        const lang = await getGuild(message.guild.id).language
        const ping = Math.round(message.client.ws.ping)
        const date = new Date()

        const embed = new MessageEmbed({
            "title": lang === "pt" ? "Informações sobre o bot" : "Information about the bot",
            "color": 15158332,
            "timestamp": date,
            "fields": [
                {
                    "name": "Delay:",
                    "value": ping + "ms",
                    "inline": true
                }, {
                    "name": lang === "pt" ? "Servidores:" : "Servers:",
                    "value": guilds.cache.size.toString(),
                    "inline": true
                },
                {
                    "name": lang === "pt" ? "Versão:" : "Version:",
                    "value": version,
                }
            ],

            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `${message.author.username}#${message.author.discriminator}`
            }
        })
        message.channel.send({embeds: [embed]})
    }
}