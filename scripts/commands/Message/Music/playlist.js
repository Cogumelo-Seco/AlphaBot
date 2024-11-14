const yts = require("yt-search");
const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.slashOptions =  [
            {
                name: 'música',
                description: 'Adicione um nome de música ou link do YT',
				required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['playlist', 'pl'];
        this.helpen = 'Adds multiple songs to the queue';
        this.help = 'Adiciona várias músicas na fila';

		this.howToUsePT = '<nome da música>'
        this.howToUseEN = '<name of the song>'
    }

    async run(message) {
        const arg = this.args.join(" ");
		const queue = this.client.queues.get(message.guild.id);
		const embed = new MessageEmbed()
		
		if (!message.member.voice.channel) return message.alphaReplyError(this.events.playSong.noChannel2)

		if (message.member.voice.channel && message.guild.me.voice.channel && message.member.voice.channel !== message.guild.me.voice.channel){
			embed
				.setColor(this.config.botColor2)
				.setDescription(`**${this.events.playSong.connected} \`${message.guild.me.voice.channel.name}\`**`)
			return message.alphaReply({ embeds: [embed] });
		}
		
		if (!arg) {
			embed
				.setColor(this.config.botColor2)
				.setDescription(this.events.playSong.noArg)
			return message.alphaReply({ embeds: [embed] });
		}

		if (queue ? queue.songs.length > 500 : null) {
            embed
                .setColor(this.config.botColor2)
                .setDescription(this.events.playSong.limit)
            return message.alphaReply({ embeds: [embed] });
        }

		embed
			.setColor(this.config.botColor1)
			.setDescription(this.events.playSong.searching)
		let msg = await message.alphaReply({ embeds: [embed] });

		try {
			let result = await yts(arg)
			
			const list = result.videos
			const song = result.videos[0];
			let rand = Math.floor(Math.random() * result.videos.length);
			let time = 0

			for (i = 0; i < list.length; i++){
				result.videos[i].user = message.user;
				let val = list[i].duration.seconds*1000
				time += val
			}

			embed
				.setColor(this.config.botColor1)
				.setThumbnail(result.videos[rand].thumbnail)
				.setDescription((this.structure.playlist.play).replace('{{list}}', list.length).replace('{{author}}', message.user.tag).replace('{{time}}', this.formatTime(time, 1)).replace('{{s}}', arg))
			msg.edit({ embeds: [embed] }).catch(() => null)
			
			if (queue) for (let i in list) queue.songs.push(list[i])
			else this.playSong(message, song, list);
		} catch (err) {
			embed
				.setColor(this.config.botColor2)
				.setDescription(this.events.playSong.noFind)
				.setThumbnail('')
			return msg.edit({ embeds: [embed] }).catch(() => null)
		}
    }
}
