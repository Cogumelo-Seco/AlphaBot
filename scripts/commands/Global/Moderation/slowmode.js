const ms = require('ms');
const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'tempo',
                description: 'Adicione um tempo',
                required: true,
                type: 3
            }
        ];
        this.permissionLevel = 21
		this.clientPermissionLevel = [26, 21]
        this.name = ['slow', 'slowmode'];
        this.helpen = 'Changes the channel\'s slow mode';
        this.help = 'Altera o modo lento do canal';

        this.howToUsePT = '<tempo>'
        this.howToUseEN = '<time>'
    }

    async run(message) {
        let time = this.args[0] ? ms(this.args[0]) : null
        let embed = new MessageEmbed()

        if (this.args[0] && this.args[0].toLowerCase() == 'off') {
            message.channel.setRateLimitPerUser(0)

            embed
                .setColor(this.config.botColor1)
                .setDescription(this.structure.slowmode.embed4_description)
            return message.alphaReply({ embeds: [embed] })
        }

        if (!this.args[0] || isNaN(time) || time < 1000 || time > 21600*1000) return message.alphaReplyError(this.structure.slowmode.embed2_description)

        message.channel.setRateLimitPerUser(time/1000)

        embed
            .setColor(this.config.botColor1)
            .setDescription(`${this.structure.slowmode.embed3_description} \`${this.args[0]}\``)
        return message.alphaReply({ embeds: [embed] })
    }
}
