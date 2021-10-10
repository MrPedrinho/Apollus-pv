const { Client } = require("discord.js")
const fs = require("fs")
const {createGuild, getGuild, deleteGuild, selectLanguage, connectMongo, Server} = require("./assets");
require("dotenv").config()

//https://discord.com/oauth2/authorize?client_id=894845421380337684&scope=bot&permissions=36809984

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]})

// Mongoose

connectMongo().catch(err => console.log(err))

// Discord.js

const cmdIdx = {en: {}, pt: {}}

const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith(".js"));
commandFiles.forEach(file => {
    const path = `${__dirname}/commands/${file.toLowerCase()}`
    const cmd = require(path)

    cmdIdx.en[cmd.en.cmd] = path
    cmdIdx.pt[cmd.pt.cmd] = path
})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const guild = getGuild(message.guild.id)

    if (message.content.toLowerCase().trim() === "mofo help") {
        try {
            const cmd = require("./commands/ajuda")
            await cmd.execute(message, [], "en")
        } catch (e) {
            console.log(e)
        }
        return
    } else if (message.content.toLowerCase().trim() === "fdp ajuda") {
        try {
            const cmd = require("./commands/ajuda")
            await cmd.execute(message, [], "pt")
        } catch (e) {
            console.log(e)
        }
        return
    }

    if (message.content === "fdp português" || message.content === "fdp portugues" || message.content === "mofo english" && !guild) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        let language
        switch(message.content.toLowerCase().trim()) {
            case "mofo english": {
                language = "en"
                break
            }
            case "fdp portugues": {
                language = "pt"
                break
            }
            case "fdp português": {
                language = "pt"
                break
            }
            default: {
                language = "en"
            }
        }

        const newMsg = message.guild.me.permissions.has("READ_MESSAGE_HISTORY") && await message.reply(language === "pt" ? "Aguarda..." : "Please wait...")

        await Server
            .create({guild_id: message.guild.id, language})

        createGuild(message.guild.id, language)

        message.guild.me.permissions.has("READ_MESSAGE_HISTORY") && await newMsg.edit(language === "pt" ? "Sucesso, o Apollus está pronto para utilizar" : "Success, Apollus is now ready to use!")
        return
    }

    const trimmed = message.content.toLowerCase().trim()
    if (trimmed === "fdp") {
        try {
            await message.reply("Filho da puta és tu")
        } catch (err) {
            console.log(err)
        }
    } else if (trimmed === "mofo") {
        try {
            await message.reply("The one motherfucker here is you")
        } catch (err) {
            console.log(err)
        }
    }


    const [prefix, cmd, ...props] = message.content.split(" ")

    if (prefix !== "fdp" && prefix !== "mofo") return

    if (!cmd) return;

    if (!guild) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        await selectLanguage(message.guild)
        return
    }

    const lang = guild.language

    if (lang === "pt" && prefix !== "fdp") return
    if (lang === "en" && prefix !== "mofo") return

    const indexedCmd = cmdIdx[lang][cmd.toLowerCase()]

    guild.setPlayer()

    try {
        if (!indexedCmd) {
            if (lang === "en") return await message.reply("Are you that dumb? That's not a command, dip shit")
            return await message.reply("És estúpido ou fazes-te? Isso não é um comando, porra")
        }
    } catch (e) {
        console.log(e)
    }

    try {
        const command = require(indexedCmd);
        await command.execute(message, props.filter(p => p.length > 0))
    } catch (err){
        console.log(err)
        await message.reply(lang === "pt" ? "Conseguiste partir o bot, parabéns" : "You managed to break the bot, congratulations")
    }

})

client.on("guildCreate", async (guild) => await selectLanguage(guild))

client.on("guildDelete", async (guild) => {
    deleteGuild(guild.id)
    await Server.deleteOne({guild_id: guild.id})
})

client.on("ready", () => console.log("ready bitch"))

client.login(process.env.TOKEN).then(_r => {
    client.user.setActivity("music", {type: "LISTENING"})

    const servers = client.guilds.cache
    servers.forEach(async sv => {
        let info = await Server
            .findOne({guild_id: sv.id})
            .exec()

        if (info) createGuild(sv.id, info.language)
    })

})