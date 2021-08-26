const {createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, joinVoiceChannel} = require("@discordjs/voice");
const youtube = require("play-dl");
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

    if (!song.url) {
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
