const {setConnection, playPlaylist, cleanQueue} = require("../assets");

module.exports = {
    help: "Playlist de halloween",

    async execute (message, _props) {

        const vc = message.member.voice.channel;
        if (!vc) return message.reply("Tens de estar num voice chat, cabrão");

        cleanQueue(message.guild.id)
        await setConnection(message, vc)
        await playPlaylist(message.guild.id, message,"https://www.youtube.com/playlist?list=PL_w_WlqOmL38WJdxb2MqcKgT-kVMpv9nb", ["", "hidden"])
    }
}