const { Client } = require("discord.js")
const fs = require("fs")
const {setPlayer} = require("./assets");
require("dotenv").config()

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]})

client.on("messageCreate", async (message) => {
    if (message.content.toLowerCase().trim() === "fdp") {
        try {
            await message.reply("Filho da puta és tu")
        } catch (err) {
            console.log(err)
        }
    }

    setPlayer(message.guild.id)

    const [prefix, cmd, ...props] = message.content.split(" ")

    client.user.setActivity("fdp ajuda", {type: "PLAYING"})

    if (message.author.bot) return;
    const allowedPrefix = ["fdp"]

    if (allowedPrefix.indexOf(prefix.toLowerCase()) === -1) return;
    if (!cmd) return;

    try {
        if (!fs.existsSync(`./commands/${cmd.toLowerCase()}.js`)) {
            return await message.reply("És estúpido ou fazes-te? Isso não é um comando, porra")
        }
    } catch (e) {
        throw (e)
    }

    try {
        const command = require(`./commands/${cmd.toLowerCase()}.js`);
        await command.execute(message, props)
    } catch (err){
        console.log(err)
        await message.reply("Conseguiste partir o bot, parabéns")
    }

})

client.on("ready", () => console.log("ready bitch"))

client.login(process.env.TOKEN).then(_r => console.log(client.guilds.cache.size))