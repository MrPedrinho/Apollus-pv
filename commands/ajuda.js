const fs = require("fs");
const {MessageEmbed} = require("discord.js");
const {getGuild} = require("../assets");

const ajudaCmds = {
    en: {
        cmd: "help",
        help: "Information about each command, as if you're stupid",
        usage: "mofo ajuda",
    },
    pt: {
        cmd: "ajuda",
        help: "Ajuda-te a perceber os comandos, como se fosses estúpido",
        usage: "fdp ajuda"
    }
}

const help_general = {en: [], pt: []}
const helps = {en: {}, pt: {}}

const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith(".js"));

commandFiles.forEach(file => {
    const cmd = file === "ajuda.js" ? ajudaCmds : require(`${__dirname}/${file.toLowerCase()}`)
    help_general.en.push(`\`mofo ${cmd.en.cmd}\` - ${cmd.en.help}`)
    help_general.pt.push(`\`fdp ${cmd.pt.cmd}\` - ${cmd.pt.help}`)

    helps.en[cmd.en.cmd] = `\`${cmd.en.usage}\` - ${cmd.en.help}`
    helps.pt[cmd.pt.cmd] = `\`${cmd.pt.usage}\` - ${cmd.pt.help}`
})

module.exports = {
    en: {
        cmd: "help",
        help: "Information about each command, as if you're stupid",
        usage: "mofo ajuda",
    },
    pt: {
        cmd: "ajuda",
        help: "Ajuda-te a perceber os comandos, como se fosses estúpido",
        usage: "fdp ajuda"
    },

    async execute (message, props) {

        const date = new Date()
        const lang = getGuild(message.guild.id).language

        if (props.length > 0) {
            try {

                if (!helps[props[0].toLowerCase()]) return message.reply(lang === "pt" ? "Não te posso ajudar com um comando que não existe" : "No can do, that command does not exist"); //@todo fix this

                const embed = new MessageEmbed({
                    "title": lang === "pt" ? "Está aqui a ajuda que pediste" : "Here's the help you asked for",
                    "color": 15158332,
                    "timestamp": date,
                    "description": helps[lang][props[0].toLowerCase()],
                    "footer": {
                        "icon_url": message.author.displayAvatarURL(),
                        "text": `${lang === "pt" ? "Pedido por" : "Asked by"} ${message.author.username}#${message.author.discriminator}`
                    }
                })

                message.channel.send({embeds: [embed]})
                return
            } catch (err){

                return
            }
        }

        const embed = new MessageEmbed({
            "title": lang === "pt" ? "Aqui está, agradece-me depois" : "Here, thank me later",
            "color": 15158332,
            "timestamp": date,
            "description": help_general[lang].join("\n\n"),
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `${lang === "pt" ? "Pedido por" : "Asked by"} ${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})
    }
}