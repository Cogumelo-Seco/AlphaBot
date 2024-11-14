const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26, 22]
        this.name = ['skip'];
        this.helpen = 'Skips the current song';
        this.help = 'Pula a música atual';
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

        message.react('⏭️').catch(() => null)
        queue.player.stop();
    }
}
