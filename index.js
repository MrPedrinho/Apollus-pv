const { Client } = require("discord.js")
const fs = require("fs")
const {createGuild, getGuild, deleteGuild} = require("./assets");
const mongoose = require("mongoose")
require("dotenv").config()

//https://discord.com/oauth2/authorize?client_id=894845421380337684&scope=bot&permissions=36719616

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]})


// Mongoose

const Server = new mongoose.model("Server", new mongoose.Schema({
    guild_id: String,
    language: String
}))

async function connectMongo() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}
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

    const guild = getGuild(message.guild.id)
    if (!guild) return;
    const lang = guild.language

    guild.setPlayer()

    const [prefix, cmd, ...props] = message.content.split(" ")

    if (message.author.bot) return;

    if (lang === "pt" && prefix !== "fdp") return
    if (lang === "en" && prefix !== "mofo") return

    if (!cmd) return;

    const indexedCmd = cmdIdx[lang][cmd.toLowerCase()]

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
        await command.execute(message, props)
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
    client.user.setActivity("fdp ajuda", {type: "PLAYING"})

    const servers = client.guilds.cache
    servers.forEach(async sv => {
        let info = await Server
            .findOne({guild_id: sv.id})
            .exec()

        if (info) createGuild(sv.id, info.language)

        if (!info) await selectLanguage(sv);
    })

})

async function selectLanguage(guild) {
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
        if(channel.type === "GUILD_TEXT" && defaultChannel === "") {
            if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    })

    await defaultChannel.send(`<@!${guild.ownerId}> Hello, I'm Apollus.
    Say \`mofo english\` to choose English
    Diz \`fdp português\` para escolher Português
    `)

    defaultChannel.awaitMessages({filter: m => (m.content === "fdp português" || m.content === "mofo english") && m.member.permissions.has("ADMINISTRATOR"), max: 1})
        .then(async (collected) => {
            const content = collected.map(d => d.content)[0]
            const language = content === "mofo english" ? "en" : "pt"

            const newMsg = await defaultChannel.send(language === "pt" ? "Aguarda..." : "Please wait...")

            await Server
                .create({guild_id: guild.id, language})

            newMsg.edit(language === "pt" ? "Sucesso, o Apollus está pronto para utilizar" : "Success, Apollus is now ready to use!")
            createGuild(guild.id, language)
        })
        .catch(err => console.log(err))
}