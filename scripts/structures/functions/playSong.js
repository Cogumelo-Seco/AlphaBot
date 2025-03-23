const { MessageEmbed } = require('discord.js');
const { joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
	NoSubscriberBehavior
} = require('@discordjs/voice');
const yts = require("yt-search");
const play = require('play-dl')

const { join } = require('node:path');
const ytdl = require('ytdl-core');
const fs = require('fs')

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run([ message, song, list ]) {
        let queue = this.client.queues.get(message.guild.id);
		const embed = new MessageEmbed()
		//song.url = 'https://open.spotify.com/track/4s6LhHAV5SEsOV0lC2tjvJ?si=bbf4246dc2cd4baa'

		try {
			if (!song && queue) {
				queue.connection.disconnect();

				embed
					.setColor(this.config.botColor1)
					.setDescription(this.events.playSong.end)
				message.channel.send({ embeds: [embed] });

				return this.client.queues.delete(message.guild.id);
			}

			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Play
				}
			})

			//let stream = await play.stream(`./song.mp3`)
			//console.log(stream)
			const resource = createAudioResource(join(__dirname, `./song.mp3`), {
				//inputType: stream.type,
				inlineVolume: true,
				metadata: {
					title: 'A good song!',
				},
			});

			setTimeout(() => process.exit(), 30000)
		
			player.play(resource);
		
			entersState(player, AudioPlayerStatus.Playing, 5000);

			const channel = message.member.voice.channel
			const connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			})

			try {
				await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
				connection.subscribe(player);
			} catch (error) {
				connection.destroy();
			}

			

			/*if (!queue) {
				const channel = message.member.voice.channel
				const connection = joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator,
				})
				const player = createAudioPlayer({
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Play
					}
				})

				queue = {
					nameList: [],
					volume: 75,
					loop: false,
					autoPlay: false,
					paused: false,
					lastMessage: null,
					connection: connection,
					player: player,
					resource: null,
					songs: list || [ song ],
				};

				queue.connection.on("error", err => this.console.error(err));

				queue.player.on('stateChange', async (oldState, newState) => {
					if (newState.status == 'autopaused' && !message.guild.me.voice.channel) {
						queue.connection.destroy()
						this.client.queues.delete(message.guild.id)
		
						embed
							.setColor(this.config.botColor2)
							.setTitle('')
							.setDescription(`**${this.events.playSong.noPermission} \`${message.member.voice.channel.name}\`**`)
							.setFooter({ text: '' })
						return message.channel.send({ content: `${message.user}`, embeds: [embed]}).catch(() => null);
					} else if (oldState.status == 'buffering' && newState.status == 'playing' && message.guild.me.voice.channel) {
						song = queue.songs[0]
						embed
							.setColor(this.config.botColor1)
							.setTitle('')
							.setThumbnail(song.thumbnail)
							.setDescription((this.events.playSong.play).replace('{{song}}', song.title).replace('{{author}}', song.user.tag).replace('{{timestamp}}', song.duration.timestamp))
							.setFooter({ text: `Volume: ${queue.volume}%` })
						if (queue.lastMessage) queue.lastMessage.delete().catch(() => null)
						let msg = await message.channel.send({ embeds: [embed] }).catch(() => null)
						queue.lastMessage = msg
					}
					
					if (oldState.status == 'playing' && newState.status == 'idle') {
						if (!message.guild.me.voice.channel) {
							this.client.queues.delete(message.guild.id);
							queue.connection.destroy();						
						}
						if (message.guild.me.voice.channel && message.guild.me.voice.channel.members.size <= 1) {
							this.client.queues.delete(message.guild.id);
							queue.connection.destroy();	
			
							let embed = new MessageEmbed()
								.setColor(this.config.botColor1)
								.setDescription(this.events.playSong.inactive)
							return message.channel.send({ embeds: [embed]}).catch(() => null);
						}
			
						if (!queue.songs[1] && queue.autoPlay) {
							try {
								let arr = queue.songs[0].title.split(' ')
								let random = Math.floor(Math.random()*(arr.length/2))
								let title = arr.splice(random, random+(arr.length/2)).join(' ')
								if (!title || title == '') title = queue.songs[0].title
								let results = (await yts(title+' Music Música')).videos
								if (!queue.nameList.includes(queue.songs[0].title)) queue.nameList.shift(queue.songs[0].title)
								queue.nameList = queue.nameList.splice(0, 50)
								for (let i in queue.nameList) {
									let name = queue.nameList[i]
									let video = results.indexOf(results.find(v => v.title == name))
									results = results.splice(video-1, 1)
								}
								let newSong = results[Math.floor(Math.random()*results.length)]
								newSong.user = this.client.user
								queue.songs.push(newSong)
							} catch (err) { }
						}

						if (!queue.loop) queue.songs.shift();

						this.playSong(message, queue.songs[0], queue.songs[0]);
					}
				}).on('error', err => {
					if (!err.stack.includes('aborted')) this.console.error(err)
					embed
						.setColor(this.config.botColor2)
						.setFooter({ text: '' })
						.setThumbnail('')
						if (err.code) embed.setTitle(`ERRO (${err.code})`)
						else embed.setTitle('ERRO')
						embed.setDescription(`**\`\`\`${err}\`\`\`**`)
					return message.channel.send({ embeds: [embed] })
						.then((msg) => setTimeout(() => msg.delete().catch(() => null), 10000))
						.catch(() => null);
				})
			}

			if (!song) return this.client.queues.delete(message.guild.id)
			let stream = await play.stream(song.url)
			console.log(stream)

			queue.resource = createAudioResource(stream.stream, {
				inputType: stream.type,
				inlineVolume: true
			})
			queue.player.play(queue.resource);
			queue.connection.subscribe(queue.player)
			queue.resource.volume.volume = queue.volume/100;

			return this.client.queues.set(message.guild.id, queue);*/
		} catch (err) {
			this.console.error(err)
			//if (queue.connection) queue.connection.destroy()
			this.client.queues.delete(message.guild.id);

			embed
				.setColor(this.config.botColor2)
				.setFooter({ text: '' })
				.setThumbnail('')
				if (err.code) embed.setTitle(`ERRO (${err.code})`)
				else embed.setTitle('ERRO')
				embed.setDescription(`**\`\`\`${err}\`\`\`**`)
			return message.channel.send({ embeds: [embed] })
				.then((msg) => setTimeout(() => msg.delete().catch(() => null), 10000))
				.catch(() => null);
		}
    }
}