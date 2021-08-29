const {createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, joinVoiceChannel,
    VoiceConnectionStatus, entersState
} = require("@discordjs/voice");
const {MessageEmbed} = require("discord.js");
const youtube = require("play-dl")

let looping = false
let queue = []
let previousMusic = {}
let connection
let player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
})


async function video_player() {
    if (!connection) return;
    const song = queue[0]

    if (!song?.url) {
        return player.stop()
    }

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
            "text": `Música de ${song.author.username}#${song.author.discriminator}`
        }
    })

    song.channel.send({embeds: [embed]})


    //ytdl quando resolverem o bug https://github.com/fent/node-ytdl-core/issues/994

    let stream = await youtube.stream(song.url)

    /*let stream = youtubedl(song.url, {
        o: '-',
        q: '',
        f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
        r: '100K',
    }, { stdio: ['ignore', 'pipe', 'ignore'] })*/

    // let stream = ytdl(song.url, {
    //     requestOptions: {
    //         headers: {
    //             cookie: "CONSENT=YES+srp.gws-20210728-0-RC1.en+FX+460; VISITOR_INFO1_LIVE=wpCXfTzs0Eo; LOGIN_INFO=AFmmF2swRAIgbZkusEfqeGjN-FSZugvXQGno1QbdED4akJ69vfFm7OACIFhD_B8ikOghb90Atmiiw5BUriaxwG8C21XJPYvzuaPQ:QUQ3MjNmd0ZKbEJjTVI4M3h0MFBoS2t5UllrU1NLX2RIbkxySlpTaXpUVG9ucS1WT3dSYmZaaHZBcXVNeU8weFFIazdtdy12aFFseHNhSGg2YVhHNG1aaGppcmRtLTZobWptNDNMSldJbFlOaGNMZ1hwdlRXeDU4SHJhTzlDb0tuVjJ0b1czOTJFNjdtSFcwQ090b24zbEQ5M29sQUZmZk53; _gcl_au=1.1.1413043797.1628246279; NID=221=jTJQAAl-S2IKA7e841W26kNPBjOxpXeDaonYS61WjYVFWG22R3gAZXhTdbg73oF7UtVzTXoyqspnsgTAa5qPkLb0_Dd2XsBCOHrO75czEykhGRYfYbk8YTfTeFwBeUZerWM90oFr-zF2demFSSko8jQqHIdySCmt8usfeDDS6kQ; PREF=f6=480&hl=en&tz=Europe.Lisbon&volume=100; SID=BAhxd_wgAb2aQML44FR-aizdrPkmEQGA0CFzUUlUUKAPnDJaYVEb8QB75MblkT7hMqvrUw.; __Secure-1PSID=BAhxd_wgAb2aQML44FR-aizdrPkmEQGA0CFzUUlUUKAPnDJaGMC2wa_9W7LXvS5XYsNroQ.; __Secure-3PSID=BAhxd_wgAb2aQML44FR-aizdrPkmEQGA0CFzUUlUUKAPnDJaddHrTJtzqO-0PfME_gHQJQ.; HSID=AYoh8V2PO7qc5c0ks; SSID=AweXtdgTGog2yBDr_; APISID=XEIlUn6XkZcipHN1/AJz6Fhpw-wz2Dqky9; SAPISID=popoq6RzctHrINAS/A_rLJanlR8a_XIELp; __Secure-1PAPISID=popoq6RzctHrINAS/A_rLJanlR8a_XIELp; __Secure-3PAPISID=popoq6RzctHrINAS/A_rLJanlR8a_XIELp; YSC=jUHQib-A6lM; wide=1; SIDCC=AJi4QfElLZDehVrwqPAnCTuQeWk36Z9JGjMp2CnNwZBcXsSXMjUlOhl-uT4kAvVhRtlUgQzVNSQt; __Secure-3PSIDCC=AJi4QfElPqD9rTlkMQiPTTg2GkkFkbpttIg03lS-w0FBu6WhZc_C4R9yvNnTkcNdFhEAJ_ijBYY",
    //         },
    //     },
    //     filter: "audioonly"
    // });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        connection.subscribe(player);
    } catch (error) {
        connection.destroy();
        throw error;
    }

    // const resource = createAudioResource(stream.stream, {inputType: stream.type});
    const resource = createAudioResource(stream.stream, {inputType: stream.type});
    // const resource = createAudioResource(stream.stdout, {seek:0, volume: 0.5});

    player.play(resource);
    player.on(AudioPlayerStatus.Idle, () => {
        if (looping) {
            video_player()
        } else {
            previousMusic = song
            queue.shift()
            video_player()
        }
    })
    return true
}

module.exports = {
    player,

    getConnection () {return connection},

    async setConnection (message, vc) {
        try {
            connection = await joinVoiceChannel({
                channelId: vc.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
        } catch (err) {
            console.log(err)
        }
        return true
    },

    async addToQueue(song) {
        queue.push(song)
        try {
            if (queue.length === 1) await video_player()
        } catch (err) {
            console.log(err)
        }
    },

    getQueue() {
        return queue
    },

    setLooping (val) {
        if (!val) {
            looping = !looping
            return {newStatus: looping}
        }
        const yesValues = ["sim", "s", "yes", "true"]
        const noValues = ["nao", "não", "n", "no", "false"]

        if (yesValues.indexOf(val.toLowerCase()) > -1) {
            looping = true
        } else if (noValues.indexOf(val.toLowerCase()) > -1) {
            looping = false
        } else {
            return {notFound: true}
        }
        return {newStatus: looping}
    },

    shiftQueue () {
        queue.shift()
    },

    getFirstItem() {
        return queue[0]
    },

    resetQueue() {
        queue = []
    },

    removeSong(query) {
        let found = false
        let answer
        queue.slice(1).forEach((song, idx) => {
            if (found) return;

            if (song.title.toLowerCase().search(query.toLowerCase().trim()) > -1) {
                answer = queue.splice(idx+1, 1)
                found = true
            }
        })
        if (!found) {
            return false
        }
        return answer[0]
    },

    async playPrevious() {
        if (!previousMusic) return false;
        queue.unshift(previousMusic)

        try {
            await video_player()
        } catch (err) {
            console.log(err)
        }

        return true
    },

    async skipSong(message) {
        const song = queue[0]

        previousMusic = song

        const date = new Date()

        const embed = new MessageEmbed({
            "title": "A música vou saltar, ou porrada vou levar",
            "color": 15158332,
            "timestamp": date,
            "description": `
                Agradeçam a <@${message.author.id}> por saltar a música
                [${song.title}](${song.url})
            `,
            "thumbnail": {
                "url": song.thumbnail_url
            },
            "footer": {
                "icon_url": song.author.displayAvatarURL(),
                "text": `Música de ${song.author.username}#${song.author.discriminator}`
            }
        })

        song.channel.send({embeds: [embed]})

        queue.shift()
        if (queue.length === 0) {
            player.stop()
            return
        }

        try {
            await video_player()
        } catch (err) {
            console.log(err)
        }
    },

    video_player
};
