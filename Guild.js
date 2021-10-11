const {MessageEmbed} = require("discord.js");
const youtube = require("play-dl");
const {entersState, VoiceConnectionStatus, createAudioResource,
    createAudioPlayer,
    NoSubscriberBehavior,
    AudioPlayerStatus, joinVoiceChannel
} = require("@discordjs/voice");

class Guild {
    queue = []
    player = undefined
    looping = false
    previous_music = undefined
    idler = undefined
    connection = undefined
    timeout = undefined

    constructor(language, id) {
        this.language = language
        this.id = id
    }

    deactivateTimeout() {
        this.timeout && clearTimeout(this.timeout)
    }

    inactiveTimeout() {
        this.player && this.player.stop()
        this.timeout = setTimeout(async () => {
            if (this.queue.length > 0) return
            this.player = undefined
            this.idler = undefined
            this.connection && this.connection.destroy()
            this.connection = undefined

            if (this.previousMusic) {
                this.previousMusic.channel.send(this.language === "pt" ? "Como vocês me abandonaram, eu saí. Fodam-se a todos" : "Since you guys abandoned me, I'm leaving. Fuck y'all")
                this.previousMusic = undefined
            }
        }, 10 * 1000) // 15 * 60 * 1000
    }

    async play(song) {
        if (!song?.url) return this.inactiveTimeout()
        this.deactivateTimeout()
        const date = new Date()
        const lang = this.language

        const embed = new MessageEmbed({
            "title": lang === "pt" ? "Prepara-te para dançar 💃🕺, está agora a tocar" : "Get your moves ready 💃🕺, the next song is coming right up!",
            "color": 15158332,
            "timestamp": date,
            "description": `
                [${song.title}](${song.url})
                **${lang === "pt" ? "Duração" : "Length"}** - [${song.duration}](${song.url})
            `,
            "thumbnail": {
                "url": song.thumbnail_url
            },
            "footer": {
                "icon_url": song.author.displayAvatarURL(),
                "text": `${lang === "pt" ? "Música de" : "Song by"} ${song.author.username}#${song.author.discriminator}`
            }
        })

        song.channel.send({embeds: [embed]})

        try {
            const stream = await youtube.stream(song.url, {cookie: process.env.COOKIES})
            await entersState(this.connection, VoiceConnectionStatus.Ready, 30_000);
            this.connection.subscribe(this.player)
            const resource = createAudioResource(stream.stream, {inputType: stream.type});
            this.player.play(resource);
        } catch (e) {
            console.log(e)
        }
    }

    async video_player() {
        if (!this.player) this.setPlayer()

        if (!this.connection) return;

        const song = this.queue[0]

        if (!song?.url) {
            this.inactiveTimeout()
            return
        }

        try {
            await this.play(song)

        } catch (err) {
            song.channel.send(this.language === "pt" ? "Algum fdp fez esta merda parar" : "Some mofo made this shit crash")
            this.connection && this.connection.destroy();
            this.connection = undefined
            await this.player.stop()
            this.player = undefined
            this.idler = undefined
            this.queue = []
            throw err
        }

        return true
    }

    setPlayer() {
        this.queue = this.queue || []
        this.player = this.player || createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        })
        this.connection = this.connection || undefined
        this.looping = this.looping || false
        this.previousMusic = this.previousMusic || undefined

        if (!this.idler) {
            this.idler = this.player.on(AudioPlayerStatus.Idle, async () => {
                if (!this.looping) {
                    this.previousMusic = this.queue[0]
                    this.queue.shift()
                }
                await this.play(this.queue[0])
            })
        }
    }

    async setConnection(message, vc) {
        if (!this.player) this.setPlayer()

        try {
            this.connection = await joinVoiceChannel({
                channelId: vc.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
        } catch (err) {
            console.log(err)
        }
        return true
    }

    async playPlaylist(message, url, options) {
        const playlist = await youtube.playlist_info(url)
        const videos = []

        playlist.videos.forEach(v => {
            videos.push({
                title: v.title,
                url: v.url,
                duration: v.durationRaw,
                durationSec: v.durationInSec,
                thumbnail_url: v.thumbnail.url,
                author: message.author,
                channel: message.channel
            })
        })

        if (options[0]?.toLowerCase() !== "noshuffle") {
            this.shuffleArray(videos)
        }

        const date = new Date()
        const lang = this.language

        const embed = new MessageEmbed({
            "title": lang === "pt" ? "Playlist adicionada" : "Playlist added",
            "color": 15158332,
            "timestamp": date,
            "description": options[1] === "hidden" ?
                `
                **${playlist.title}**
                ${lang === "pt" ? "Nº de Músicas" : "Number of Songs"}: ${playlist.total_videos}
            `
                : `
                [${playlist.title}](${playlist.url})
                **${lang === "pt" ? "Nº de Músicas" : "Number of Songs"}**: ${playlist.total_videos}
            `,
            "thumbnail": {
                "url": playlist.thumbnail.url
            },
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `${lang === "pt" ? "Playlist colocada por" : "Playlist by"} ${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})

        for (const v of videos) {
            await this.addToQueue(v);
        }
    }

    async addToQueue (song) {
        if (!this.player) this.setPlayer()
        this.queue.push(song)
        try {
            if (this.queue.length === 1) await this.video_player(song.channel.guild.id)
        } catch (err) {
            console.log(err)
        }
    }

    async skipSong(message) {
        const song = this.queue[0]

        if (!song?.url) return;

        this.previousMusic = song

        const date = new Date()
        const lang = this.language

        const embed = new MessageEmbed({
            "title": lang === "pt" ? "A música vou saltar, ou porrada vou levar" : "The music I will skip, or help I will seek",
            "color": 15158332,
            "timestamp": date,
            "description": `
                ${lang === "pt" ? `Agradeçam a <@${message.author.id}> por saltar a música` : `Thank <@${message.author.id}> for skipping the song`}
                [${song.title}](${song.url})
            `,
            "thumbnail": {
                "url": song.thumbnail_url
            },
            "footer": {
                "icon_url": song.author.displayAvatarURL(),
                "text": `${lang === "pt" ? "Música de" : "Song by"} ${song.author.username}#${song.author.discriminator}`
            }
        })

        await song.channel.send({embeds: [embed]})

        this.queue.shift()

        try {
            await this.video_player()
        } catch (err) {
            console.log(err)
        }
    }

    cleanQueue() {
        this.queue = []
        this.player.stop()
        this.player = undefined
        this.idler = undefined
    }

    getQueue() {
        return this.queue
    }

    getPlayer() {
        return this.player
    }

    setLooping(val) {
        if (!val) {
            this.looping = !this.looping
            return {newStatus: this.looping}
        }
        const yesValues = ["sim", "s", "yes", "true"]
        const noValues = ["nao", "não", "n", "no", "false"]

        if (yesValues.indexOf(val.toLowerCase()) > -1) {
            this.looping = true
        } else if (noValues.indexOf(val.toLowerCase()) > -1) {
            this.looping = false
        } else {
            return {notFound: true}
        }
        return {newStatus: this.looping}
    }

    removeSong(query) {
        let found = false
        let answer
        this.queue.slice(1).forEach((song, idx) => {
            if (found) return;

            if (song.title.toLowerCase().search(query.toLowerCase().trim()) > -1) {
                answer = this.queue.splice(idx+1, 1)
                found = true
            }
        })
        if (!found) {
            return false
        }
        return answer[0]
    }

    async playNow(song) {
        this.queue.unshift(song)

        try {
            await this.video_player()
        } catch (err) {
            console.log(err)
        }

        return true
    }

    async playPrevious() {
        if (!this.previousMusic) return false;
        this.queue.unshift(this.previousMusic)

        try {
            await this.video_player()
        } catch (err) {
            console.log(err)
            return false
        }

        return true
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array
    }


    async restartSong() {
        try {
            await this.video_player()
        } catch (err) {
            console.log(err)
        }
    }

    kill () {
        this.connection && this.connection.destroy()
        this.connection = undefined
        this.queue = []
        this.player.stop()
        this.player = undefined
        this.idler = undefined
        this.looping = false
    }
}

module.exports = {Guild}