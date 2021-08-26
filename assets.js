const {createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, joinVoiceChannel} = require("@discordjs/voice");
const youtube = require("play-dl");
const {MessageEmbed} = require("discord.js");
let queue = []
let connection
let player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
})

async function video_player() {
    if (!connection) return;
    const song = queue[0]
    console.log(song)

    const date = new Date()

    const embed = new MessageEmbed({
        "title": "Prepara-te para dançar 💃🕺, está agora a tocar (Os Lusíadas, v.3-4)",
        "color": 15158332,
        "timestamp": date,
        "description": `
                [${song.title}](${song.url})
                **Duração** - [${song.duration}](${song.url})
            `,
        "thumbnail": {
            "url": song.thumbnail_url
        },
        "footer": {
            "icon_url": song.author.displayAvatarURL(),
            "text": `Colocada por ${song.author.username}#${song.author.discriminator}`
        }
    })

    song.channel.send({embeds: [embed]})

    if (!song?.url) {
        return player.stop()
    }

    let stream = await youtube.stream(song.url)
    connection.subscribe(player)

    const resource = createAudioResource(stream.stream, {inputType: stream.type});

    player.play(resource);
    player.on(AudioPlayerStatus.Idle, () => {
        queue.shift()
        video_player()
    })
    return true
}

module.exports = {
    player,

    async setConnection (message, vc) {
        connection = await joinVoiceChannel({
            channelId: vc.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });
        return true
    },

    async addToQueue(song) {
        queue.push(song)
        if (queue.length === 1) await video_player()
    },

    getQueue() {
        return queue
    },

    shiftQueue () {
        queue.shift()
    },

    getFirstItem() {
        return queue[0]
    },

    async skipSong() {
        queue.shift()
        await video_player()
    },

    video_player
};
