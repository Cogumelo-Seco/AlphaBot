const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['loop'];
        this.helpen = 'Loop current music';
        this.help = 'Deixa a musica atual em loop';
    }

    async run(message) {
        const queue = this.client.queues.get(message.guild.id);

        if (!queue) return message.alphaReplyError(this.events.playSong.noSong)
        if (!message.member.voice.channel) return message.alphaReplyError(this.events.playSong.noChannel2)

        if (message.member.voice.channel && message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id){
            embed
                .setColor(this.config.botColor2)
                .setDescription(`**${this.events.playSong.connected} \`${message.guild.me.voice.channel.name}\`**`)
            return message.alphaReply({ embeds: [embed] });
        }

        if (queue.autoPlay) return message.alphaReplyError(this.structure.loop.autoplayActivated)

        if (queue.loop){
            queue.loop = false
            const embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription(this.structure.loop.off)
            return message.alphaReply({ embeds: [embed] });
        } else {
            queue.loop = true
            const embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription(this.structure.loop.on)
            return message.alphaReply({ embeds: [embed] });
        }
    }
}
