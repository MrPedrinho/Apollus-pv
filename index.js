const { Client } = require("discord.js")
const ytdl = require('ytdl-core');
const { token } = require("./config.json")

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]})

client.on("messageCreate", async (message) => {
    const [prefix, cmd, ...props] = message.content.split(" ")

    if (message.author.bot) return;
    const allowedPrefix = ["fdp"]

    if (allowedPrefix.indexOf(prefix.toLowerCase()) === -1) return;
    if (!cmd) return;

    const command = require(`./commands/${cmd.toLowerCase()}.js`);
    if (!command) return;
    await command.execute(message, props)

})

client.on("ready", () => console.log("ready bitch"))

client.login(token)