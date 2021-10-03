const {setLooping} = require("../assets");
module.exports = {
    help: "Control o loop da música. Valores aceitos `sim s yes true` e `não nao n no false`",
    usage: "fdp ajuda <valor (opcional)>",

    async execute (message, props) {

        const answer = setLooping(props[0], message.guild.id)

        if (answer.notFound) {
            message.reply("Nao conheço esse valor, para saberes os valores que podes utilizar `fdp ajuda loop`")
        } else {
            message.reply(`O looping da música foi ${answer.newStatus === true ? "ativado" : "desativado"}`)
        }

    }
}