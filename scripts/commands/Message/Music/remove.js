const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'número',
                description: 'Adicione o número da música a ser removida',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['remove'];
        this.helpen = 'Removes a specific song from the queue';
        this.help = 'Remove uma música específica da fila';

        this.howToUsePT = '<número da música>'
        this.howToUseEN = '<song number>'
    }

    async run(message) {
        const amount = Number(this.args.join(" "));
        const queue = this.client.queues.get(message.guild.id);

        if (!queue) return message.alphaReplyError(this.events.playSong.noSong)
        if (!queue.resource.audioPlayer) return
        if (!message.member.voice.channel) return message.alphaReplyError(this.events.playSong.noChannel2)

        if (message.member.voice.channel && message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id){
            embed
                .setColor(this.config.botColor2)
                .setDescription(`**${this.events.playSong.connected} \`${message.guild.me.voice.channel.name}\`**`)
            return message.alphaReply({ embeds: [embed] });
        }

        if (isNaN(amount) || amount < 1 || amount > queue.songs.length-1) {
            const embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription(this.structure.remove.invalid);
            return message.alphaReply({ embeds: [embed] });
        }

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription((this.structure.remove.embed_description).replace('{{amount}}', amount).replace('{{title}}', queue.songs[amount].title));
        
        queue.songs.splice(amount, 1);
        return message.alphaReply({ embeds: [embed] });
    }
}
