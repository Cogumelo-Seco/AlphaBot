const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['disconnect', 'desconectar', 'stop'];
        this.helpen = 'Pare a reprodução e exclua a lista de música';
        this.help = 'Stop playback and delete the music list';
    }

    async run(message) {
        const queue = this.client.queues.get(message.member.guild.id);
        const embed = new MessageEmbed()

        if (!queue) return message.alphaReplyError(this.events.playSong.noSong)
        if (!message.member.voice.channel) return message.alphaReplyError(this.events.playSong.noChannel2)

        if (message.member.voice.channel && message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id){
            embed
                .setColor(this.config.botColor2)
                .setDescription(`**${this.events.playSong.connected} \`${message.guild.me.voice.channel.name}\`**`)
            return message.alphaReply({ embeds: [embed] });
        }

        queue.songs = []
        queue.player.stop()
    }
}

