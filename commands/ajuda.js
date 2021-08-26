const fs = require("fs");
const {MessageEmbed} = require("discord.js");

const help_general = []
const helps = {}

const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith(".js"));

commandFiles.forEach((file) => {
    if (file === "ajuda.js") {
        help_general.push(`\`fdp ajuda\` - Ajuda-te a perceber os comandos, como se fosses estúpido`)
        helps["ajuda"] = `\`fdp ajuda\` - Ajuda-te a perceber os comandos, como se fosses estúpido`
    } else {
        const cmd = require(`${__dirname}/${file.toLowerCase()}`)
        help_general.push(`\`fdp ${file.split(".")[0]}\` - ${cmd.help}`)
        helps[file.split(".")[0]] = `\`fdp ${file.split(".")[0]}\` - ${cmd.help}`
    }
})

module.exports = {
    help: "Ajuda-te a perceber os comandos, como se fosses estúpido",

    async execute (message, props) {

        const date = new Date()

        if (props.length > 0) {
            try {

                if (!helps[props[0].toLowerCase()]) return message.reply("Não te posso ajudar com um comando que não existe");

                const embed = new MessageEmbed({
                    "title": "Está aqui a ajuda que pediste",
                    "color": 15158332,
                    "timestamp": date,
                    "description": helps[props[0].toLowerCase()],
                    "footer": {
                        "icon_url": message.author.displayAvatarURL(),
                        "text": `Pedido por ${message.author.username}#${message.author.discriminator}`
                    }
                })

                message.channel.send({embeds: [embed]})
                return
            } catch (err){

                return
            }
        }

        const embed = new MessageEmbed({
            "title": "Aqui está, agradece-me depois",
            "color": 15158332,
            "timestamp": date,
            "description": help_general.join("\n"),
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `Pedido por ${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})
    }
}