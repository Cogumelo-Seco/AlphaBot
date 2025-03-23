const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['magicstone', 'advance', 'magicstones', 'pedramagica'];
        this.helpen = 'Skip the time to use the daily and assault';
        this.help = 'Pule o tempo para usar os comandos daily e assault';
    }

    async run(message) {
        const result = await this.client.schemas['user'].findById(message.user.id);

		if (+new Date()-message.user.createdAt < 864000000) return message.alphaReplyError(this.events.commands.nodateuser)

        if (result.magicstones == 0) return message.alphaReplyError(this.structure.magicstone.nostone)

        if (+new Date() > result.alphaCoinsDelay+43200000 && +new Date() > result.diamondsDelay+43200000) return message.alphaReplyError(this.structure.magicstone.nouse)
        if (+new Date() > result.alphaCoinsDelay+43200000) return message.alphaReplyError(this.structure.magicstone.nouseassault)
        if (+new Date() > result.diamondsDelay+43200000) return message.alphaReplyError(this.structure.magicstone.nousediary)
        
        let percent = Math.floor(Math.random() * 100);
        result.magicstones = result.magicstones-1

        if (percent < 90) {
            result.alphaCoinsDelay = 0
            result.diamondsDelay = 0
            
            const embed = new MessageEmbed()
                .setColor(result.color || this.config.botColor1)
                .setDescription(this.structure.magicstone.success)
                .setThumbnail('https://cdn.discordapp.com/attachments/766010028314066965/903349178808291338/world_crystal_small.gif')
            message.alphaReply({ embeds: [embed] })
        } else {
            result.alphaCoinsDelay = result.alphaCoinsDelayalphaCoinsDelay+86400000
            result.diamondsDelay = result.diamondsDelay+86400000

            const embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription(this.structure.magicstone.lost)
				.setThumbnail('https://cdn.discordapp.com/attachments/792642251519426590/899473060049092618/66e6407c40863b263f4ed8e2bc1a3119.gif')
            message.alphaReply({ embeds: [embed] })
        }
        return result.save()
    }
}
