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
    console.log("hey")
    if (!connection) await setConnection()
    const song = queue[0]
    console.log(song)

    let stream = await youtube.stream(song.url)
    console.log(connection)
    connection.subscribe(player)

    const resource = createAudioResource(stream.stream, {inputType: stream.type});
    console.log("gg")
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
        console.log("hdddey")
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

    skipSong() {

    },

    video_player
};
