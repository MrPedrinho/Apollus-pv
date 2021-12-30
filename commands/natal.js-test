const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "christmas",
        help: "Christmas Playlist",
        usage: "mofo christmas"
    },
    pt: {
        cmd: "natal",
        help: "Playlist de natal",
        usage: "fdp natal",
    },

    async execute (message, _props) {

        const guild = getGuild(message.guild.id)

        const vc = message.member.voice.channel;
        if (!vc) return message.reply(guild.language === "pt" ? "Tens de estar num voice chat, cabrão" : "You need to be in a voice chat, fuckwit");

        await guild.setConnection(message, vc)
        await guild.playPlaylist(message,"https://www.youtube.com/playlist?list=PL_w_WlqOmL39P_zPb2vdMJXG_0u9RIpim", ["", "hidden"])
    }
}