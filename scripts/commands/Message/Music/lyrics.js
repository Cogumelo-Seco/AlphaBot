const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'música',
                description: 'Adicione um nome de música',
                type: 3
            }
        ];
		this.clientPermissionLevel = [26, 9]
        this.name = ['lyrics', 'lyric', 'letra', 'letras'];
        this.helpen = 'Know the lyrics of the current song, or another specific song';
        this.help = 'Saiba a letra da música atual, ou de outra específica';

        this.howToUsePT = '[nome da música]'
        this.howToUseEN = '[name of the song]'
    }

    async run(message) {
        const queue = this.client.queues.get(message.guild.id);

        if (!this.args[0] && !queue) return message.alphaReplyError(this.events.playSong.noSong)
        
        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription(this.events.playSong.searching)
        let msg = await message.alphaReply({ embeds: [embed] });

        let musicName = null
        if (!this.args[0]) musicName = queue.songs[0].title
        else musicName = this.args.slice(0).join(' ')

        let response = await request.get(`https://some-random-api.ml/lyrics?title=${musicName}`).catch(() => null)
        

        if (!response || !response.body || !response.body.lyrics) {
            const embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription(this.events.playSong.noFind)
            return msg.edit({ embeds: [embed] }).catch(() => null)
        }

        let body = response.body
        
        embed
            .setColor(this.config.botColor1)                    
            .setTitle(`${body.title} ${body.author ? ' | '+body.author : ''}`)
            .setDescription(body.lyrics)

        if (body.thumbnail && body.thumbnail.genius) embed.setThumbnail(body.thumbnail.genius)

        if (embed.length > 6000) return msg.edit({ embeds: [], files: [this.textFile(body.lyrics, `lyrics-${musicName}`)] })
        else return msg.edit({ embeds: [embed] }).catch((err) => console.log(err))
    }
}

