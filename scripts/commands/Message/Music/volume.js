const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'vol',
                description: 'Adicione o volume desejado de 0 a 100',
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['volume', 'vol'];
        this.helpen = 'Change the playback volume';
        this.help = 'Altera o volume da reprodução';

        this.howToUsePT = '[volume]'
        this.howToUseEN = '[volume]'
    }

    async run(message) {
        const queue = this.client.queues.get(message.guild.id);
        let volume = Number(this.args.join(" "));

        if (!queue) return message.alphaReplyError(this.events.playSong.noSong)
        if (!queue.resource.audioPlayer) return
        if (!message.member.voice.channel) return message.alphaReplyError(this.events.playSong.noChannel2)

        if (message.member.voice.channel && message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id){
            embed
                .setColor(this.config.botColor2)
                .setDescription(`**${this.events.playSong.connected} \`${message.guild.me.voice.channel.name}\`**`)
            return message.alphaReply({ embeds: [embed] });
        }

        if (!volume || volume < 0 || volume > 100) volume = queue.volume
        
        queue.volume = volume;
        queue.resource.volume.volume = queue.volume/100
        
        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setTitle(`${this.structure.vol.embed_title} \`${queue.volume}%\``)
            .setDescription(`**${this.progressBar(queue.volume/100, 20)}\n\`${queue.volume}% / 100%\`**`);
        return message.alphaReply({ embeds: [embed] });
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
