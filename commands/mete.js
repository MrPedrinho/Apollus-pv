const ytdl = require("ytdl-core")
const ytSearch = require("yt-search")
const youtubedl = require("youtube-dl-exec")
const youtube = require('play-dl')
const { joinVoiceChannel, createAudioResource} = require('@discordjs/voice');
const {video_basic_info} = require("play-dl");
var connection
const player = require("../assets.js").player

module.exports = {
    async execute(message, props) {
        const vc = message.member.voice.channel;

        if (!vc) return;

        if (!props.length) return;

        let song = {}
        //@todo add queue

        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

        if (props[0].match(regExp)) {
            const song_info = await video_basic_info(props[0])

            song = {title: song_info.video_details.title, url: song_info.video_details.url}
        } else {

            const video = await youtube.search(props.join(" "), {limit: 1})



            if (video) {
                song = {title: video[0].title, url: video[0].url}
            } else return;
        }

        try {
            connection = await joinVoiceChannel({
                channelId: vc.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            await video_player(message.guild, song)
        } catch (err) {
            console.log(err)
        }
    },
};

const video_player = async (guild, song) => {
    let stream = await youtube.stream(song.url)

    connection.subscribe(player)

    const resource = createAudioResource(stream.stream, {inputType: stream.type});
    player.play(resource);
}