
module.exports = {
    help: "Atreve-te",

    async execute(message, _props) {
        try {
            await message.reply("Ping o quê ò filho da puta")
        } catch (err) {
            console.log(err)
        }
    },
};