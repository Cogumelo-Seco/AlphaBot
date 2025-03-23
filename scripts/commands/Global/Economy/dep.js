const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'quantidade',
                description: 'Adicione uma quantidade para depositar ou all para depositar tudo',
                required: true,
                type: 3,
                autocomplete: true
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['dep', 'depositar'];
        this.helpen = 'Deposit your diamonds in the bank';
        this.help = 'Deposite seus diamantes no banco';

        this.howToUsePT = '<quantidade>'
        this.howToUseEN = '<amount>'
    }

    async run(message) {
        const result = await this.client.schemas['user'].findById(message.user.id);

        if (+new Date()-message.user.createdAt < 864000000) return message.alphaReplyError(this.events.commands.nodateuser)

        let amount = Number(this.args[0])
        if (this.args[0] ? this.args[0].toLowerCase() == 'all' : null) amount = result.diamonds

        if(!amount) return message.alphaReplyError(this.structure.dep.embed4_description)

        if(amount === 0) return message.alphaReplyError(this.structure.dep.embed4_description)

        if (result.diamonds < amount) return message.alphaReplyError(this.structure.dep.embed5_description.replace('{{amount}}', amount))

        result.diamonds -= amount
        result.bank += amount
        await result.save();

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription(this.structure.dep.embed3_description.replace('{{diamonds}}', amount))
        return message.alphaReply({ embeds: [embed] })
    }

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        const result = await this.client.schemas['user'].findById(interaction.user.id);

        focusedOption.value = focusedOption.value.replace(/[^0-9]/g, '')
        const amount = result.diamonds >= Number(focusedOption.value) ? focusedOption.value || '0' : String(result.diamonds)

        interaction.respond([
            { name: 'all', value: 'all' },
            { name: `${amount} 💎`, value: amount }
        ]);
    }
}