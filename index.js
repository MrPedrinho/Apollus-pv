const { Client } = require("discord.js")
const { token } = require("./config.json")

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]})

client.on("messageCreate", async (message) => {
    if (message.content.toLowerCase().trim() === "fdp") {
        await message.reply("Filho da puta és tu")
    }

    const [prefix, cmd, ...props] = message.content.split(" ")

    client.user.setActivity("fdp ajuda", {type: "PLAYING"})

    if (message.author.bot) return;
    const allowedPrefix = ["fdp"]

    if (allowedPrefix.indexOf(prefix.toLowerCase()) === -1) return;
    if (!cmd) return;

    try {
        const command = require(`./commands/${cmd.toLowerCase()}.js`);
        await command.execute(message, props)
    } catch {
        await message.reply("És estúpido ou fazes-te? Isso não é um comando, porra")
    }

})

client.on("ready", () => console.log("ready bitch"))

client.login(token)