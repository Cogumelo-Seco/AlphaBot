const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['trabalhar', 'daily', 'work'];
        this.helpen = 'Work and get between 0 to 500 diamonds';
        this.help = 'Trabalhe e consiga entre 0 a 500 diamantes';
    }

    async run(message) {
        const result = await this.client.schemas['user'].findById(message.user.id);

        if (+new Date()-message.user.createdAt < 864000000) return message.alphaReplyError(this.events.commands.nodateuser)
        if (+new Date() < result.diamondsDelay+43200000) return message.alphaReplyError((this.structure.daily.embed_description).replace('{{time}}', `<t:${Number.parseInt((result.diamondsDelay+43200000)/1000)}:R>`))

        let valueD = Math.floor(Math.random() * 500)+100;

        result.diamondsDelay = +new Date()
        result.diamonds += Number(valueD)
        await result.save();
        
        const embed = new MessageEmbed()
            .setColor(result.color || this.config.botColor1)
            .setDescription((this.structure.daily.embed2_description).replace('{{valueD}}', valueD))
        return message.alphaReply({ embeds: [embed] })
    }
}