const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "halloween",
        help: "Halloween Playlist",
        usage: "mofo halloween"
    },
    pt: {
        cmd: "halloween",
        help: "Playlist de halloween",
        usage: "fdp halloween",
    },

    async execute (message, _props) {

        const guild = getGuild(message.guild.id)

        const vc = message.member.voice.channel;
        if (!vc) return message.reply(guild.language === "pt" ? "Tens de estar num voice chat, cabrão" : "You need to be in a voice chat, fuckwit");

        await guild.setConnection(message, vc)
        await guild.playPlaylist(message,"https://www.youtube.com/playlist?list=PL_w_WlqOmL38WJdxb2MqcKgT-kVMpv9nb", ["", "hidden"])
    }
}