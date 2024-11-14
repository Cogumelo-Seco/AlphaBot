const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.name = ['assaltar', 'assault', 'crime'];
        this.helpen = 'Make a robbery and you can get between 0A$ to 1500A$';
        this.help = 'Faça um assalto e pode conseguir entre 0A$ 1500A$';
    }

    async run(message) {
        const result = await this.client.schemas['user'].findById(message.user.id);

        if (+new Date()-message.user.createdAt < 864000000) return message.alphaReplyError(this.events.commands.nodateuser)
        
        if (+new Date() < result.alphaCoinsDelay+43200000) return message.alphaReplyError((this.structure.assault.embed_description).replace('{{time}}', `<t:${Number.parseInt((result.alphaCoinsDelay+43200000)/1000)}:R>`))

        let valueD = Math.floor(Math.random() * 1400)+200;

        result.alphaCoinsDelay = +new Date()
        result.alphaCoins += Number(valueD)
        await result.save();

        const embed = new MessageEmbed()
            .setColor(result.color || this.config.botColor1)
            .setDescription((this.structure.assault.embed2_description).replace('{{valueD}}', valueD))
        return message.alphaReply({ embeds: [embed] })
    }
}