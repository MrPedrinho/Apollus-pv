const {setLooping} = require("../assets");
module.exports = {
    help: "Ativa o loop da música - valores aceitos `sim s yes true` e `não nao n no false`",

    async execute (message, props) {
        const answer = setLooping(props[0], message.guild.id)

        if (answer.notFound) {
            message.reply("Nao conheço esse valor, para saberes os valores que podes utilizar `fdp ajuda loop`")
        } else {
            message.reply(`O looping da música foi ${answer.newStatus ? "ativado" : "desativado"}`)
        }

    }
}