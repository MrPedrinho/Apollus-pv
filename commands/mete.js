const youtube = require('play-dl')
const {video_basic_info} = require("play-dl");

const {addToQueue, setConnection} = require("../assets")

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
            await setConnection(message, vc)
            await addToQueue(song)
        } catch (err) {
            console.log(err)
        }

    },
};