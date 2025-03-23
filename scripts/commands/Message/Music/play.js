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
        this.name = ['play', 'p'];
        this.helpen = 'Add a song to the queue';
        this.help = 'Adiciona uma música na fila';

        this.howToUsePT = '<nome da música>'
        this.howToUseEN = '<name of the song>'
    }

    async run(message) {
        const arg = this.args.join(" ").replace('-rob-', '');
		let videoId = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/gi.exec(arg)
		if (videoId && videoId[1]) {
			if (message.editedTimestamp) return			
			videoId = videoId[1]
		}
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
        };

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
            let result;
            if (videoId) result = { videos: [await yts({ videoId }).catch(() => null)] }
			if (!result || !result.videos[0]) result = await yts(arg)
                        
            const song = result.videos[0]; 
            song.user = message.user

            embed
                .setColor(this.config.botColor1)
                .setThumbnail(song.thumbnail)
                .setDescription((this.structure.play.play).replace('{{songs.length}}', queue ? queue.songs.length : 0).replace('{{title}}', song.title).replace('{{url}}', song.url).replace('{{author}}', message.user.tag).replace('{{timestamp}}', song.duration.timestamp))
            msg.edit({ embeds: [embed] }).catch(() => null)
            
            if (queue) {
                if (this.args.join(" ").includes('-rob-')) {
                    queue.songs.unshift(song);
                    queue.songs.unshift(queue.songs[1])
                    queue.songs.splice(2, 1)
                } else queue.songs.push(song);
            } else this.playSong(message, song, null);
        } catch (err) {
            embed
                .setColor(this.config.botColor2)
                .setDescription(this.events.playSong.noFind)
            return msg.edit({ embeds: [embed] }).catch(() => null)
        }
    }
}
