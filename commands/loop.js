const {getGuild} = require("../assets");
module.exports = {
    en: {
        cmd: "loop",
        help: "Toggles track looping. Accepted values: `yes y true` and `no n false`. If no value is provided, it will toggle the setting.",
        usage: "mofo loop <value (optional)>"
    },
    pt: {
        cmd: "loop",
        help: "Controla o loop da música. Valores aceitos: `sim s yes true` e `não nao n no false`. Se não meteres nenhum valor, fica o valor oposto.",
        usage: "fdp loop <valor (opcional)>",
    },

    async execute (message, props) {

        const guild = getGuild(message.guild.id)
        const lang = guild.language

        const answer = guild.setLooping(props[0])

        if (answer.notFound) {
            message.reply(lang === "pt" ? "Não conheço esse valor, para saberes os valores que podes utilizar `fdp ajuda loop`" : "Don't know that value. Use `mofo help loop` to know which values you can use")
        } else {
            if (lang === "pt") {
                message.reply(`O looping da música foi ${answer.newStatus === true ? "ativado" : "desativado"}`)
            } else {
                message.reply(`Song loop was ${answer.newStatus === true ? "ativated" : "deactivated"}`)
            }
        }

    }
}