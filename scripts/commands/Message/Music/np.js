const { MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['np', 'tocando', 'playingnow', 'nowplaying'];
        this.helpen = 'Shows information about the current song';
        this.help = 'Mostra informações sobre a musica atual';
    }

    async run(message) {
        const queue = this.client.queues.get(message.guild.id);
        if (!queue.resource.audioPlayer) return

        if (!queue) return message.alphaReplyError(this.events.playSong.noSong)

        let val1 = queue.resource.playbackDuration
        let val2 = queue.songs[0].seconds*1000

        let percent = val1/val2

        let emoji = '🎵'
        if (queue.resource.audioPlayer._state.status == 'paused') emoji = '⏸️'

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setTitle(`${emoji}  ${queue.songs[0].title}`)
            .setDescription(`**\n${this.progressBar(percent, 20)}\n\`${this.formatTime(val1, 1)} / ${this.formatTime(val2, 1)}\`\n\`${Math.floor(percent*100)}%\`\n\n${this.structure.np.embed_description}: \`${queue.songs[0].user.tag}\`\nURL:** ${queue.songs[0].url}`)
            .setThumbnail(queue.songs[0].image)
        return message.alphaReply({ embeds: [embed] })
    }

    progressBar(prop1, prop2) {
        let str = "";
    
        for (i = 0; i < prop2; i++) {
            if (i == parseInt((prop1-0.001) * prop2))
                str += "🔵";
            else
                str += "▬";
        }
        return str;
    }
}
