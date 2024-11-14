const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['autoplay'];
        this.helpen = 'Deixe o Alpha colocar musicas automaticamente ao acabar a lista de músicas';
        this.help = 'Let Alpha automatically play songs when the playlist ends';
    }

    async run(message) {
        const queue = this.client.queues.get(message.member.guild.id);
        const embed = new MessageEmbed()

        if (!queue) return message.alphaReplyError(this.events.playSong.noSong)
        if (!queue.resource.audioPlayer) return
        if (!message.member.voice.channel) return message.alphaReplyError(this.events.playSong.noChannel2)

        if (message.member.voice.channel && message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id){
            embed
                .setColor(this.config.botColor2)
                .setDescription(`**${this.events.playSong.connected} \`${message.guild.me.voice.channel.name}\`**`)
            return message.alphaReply({ embeds: [embed] });
        }

        if (queue.loop) return message.alphaReplyError(this.structure.autoplay.loopActivated)

        if (!queue.autoPlay) {
            queue.autoPlay = true

            embed
                .setColor(this.config.botColor1)
                .setDescription(this.structure.autoplay.on)
            return message.alphaReply({ embeds: [embed] })
        } else {
            queue.autoPlay = false

            embed
                .setColor(this.config.botColor1)
                .setDescription(this.structure.autoplay.off)
            return message.alphaReply({ embeds: [embed] })
        }
    }
}

