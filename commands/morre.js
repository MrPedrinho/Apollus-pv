const {joinVoiceChannel} = require("@discordjs/voice");

module.exports = {
    async execute(message, props) {
        const connection = await joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        connection.destroy()
    }
}