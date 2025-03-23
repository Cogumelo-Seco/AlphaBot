const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

	    this.slashOptions =  [
            {
                name: 'quantidade',
                description: 'Adicione uma quantidade para extrair ou all para extrair tudo',
                required: true,
                type: 3,
                autocomplete: true
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['extrair', 'extract'];
        this.helpen = 'Remove diamonds from the bank';
        this.help = 'Retire diamantes do banco';

        this.howToUsePT = '<quantidade>'
        this.howToUseEN = '<amount>'
    }

    async run(message) {
        const result = await this.client.schemas['user'].findById(message.user.id);

        if (+new Date()-message.user.createdAt < 864000000) return message.alphaReplyError(this.events.commands.nodateuser)

        let amount = Number(this.args[0])
        if (this.args[0] ? this.args[0].toLowerCase() == 'all' : null) amount = result.bank

        if(!amount) return message.alphaReplyError(this.structure.extract.embed4_description)

        if(amount === 0) return message.alphaReplyError(this.structure.extract.embed4_description)
        
        if (result.bank < amount) return message.alphaReplyError((this.structure.extract.embed5_description).replace('{{amount}}', amount))

        result.diamonds += amount
        result.bank -= amount
        await result.save();

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription((this.structure.extract.embed3_description).replace('{{bank}}', amount))
        return message.alphaReply({ embeds: [embed] })
    }

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        const result = await this.client.schemas['user'].findById(interaction.user.id);

        focusedOption.value = focusedOption.value.replace(/[^0-9]/g, '')
        const amount = result.bank >= Number(focusedOption.value) ? focusedOption.value || '0' : String(result.bank)

        interaction.respond([
            { name: 'all', value: 'all' },
            { name: `${amount} 💎`, value: amount }
        ]);
    }
}