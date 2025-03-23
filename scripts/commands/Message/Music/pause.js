const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['pause', 'resume', 'unpause'];
        this.helpen = 'Pauses the current song';
        this.help = 'Pausa a música atual';
    }

    async run(message) {
        const queue = this.client.queues.get(message.guild.id);

        if (!queue) return message.alphaReplyError(this.events.playSong.noSong)
        if (!queue.player) return
        if (!message.member.voice.channel) return message.alphaReplyError(this.events.playSong.noChannel2)

        if (message.member.voice.channel && message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id){
            embed
                .setColor(this.config.botColor2)
                .setDescription(`**${this.events.playSong.connected} \`${message.guild.me.voice.channel.name}\`**`)
            return message.alphaReply({ embeds: [embed] });
        }

        if (queue.player._state.status == 'paused') {
            queue.player.unpause();

            const embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription(this.structure.pause.resume)
            return message.alphaReply({ embeds: [embed] });
        } else {
            queue.player.pause();

            const embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription(this.structure.pause.pause)
            return message.alphaReply({ embeds: [embed] });
        }
    }
}
