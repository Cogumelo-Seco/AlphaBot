const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.slashOptions =  [
            {
                name: 'quantidade',
                description: 'Adicione uma quantidade para trocar ou all para trocar tudo (a quantidade será dividida em 2)',
                required: true,
                type: 3,
                autocomplete: true
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['trocar', 'change'];
        this.helpen = 'Exchange your AlphaCoin for diamonds (the amount will be divided into 2)';
        this.help = 'Troque seu AlphaCoin por diamantes (a quantidade será dividida em 2)';

		this.howToUsePT = '<quantidade>'
        this.howToUseEN = '<amount>'
    }

    async run(message) {
        const result = await this.client.schemas['user'].findById(message.user.id);

		if (+new Date()-message.user.createdAt < 864000000) return message.alphaReplyError(this.events.commands.nodateuser)

		let amount = Number(this.args[0])
		if (this.args[0] ? this.args[0].toLowerCase() == 'all' : null) amount = result.alphaCoins
	
		if (!result.alphaCoins) return message.alphaReplyError(this.structure.exchange.embed_description)
	
		if(!amount) return message.alphaReplyError(this.structure.exchange.embed2_description)
	
		if(amount === 0)  return message.alphaReplyError(this.structure.exchange.embed2_description)

		if (result.alphaCoins < amount) return message.alphaReplyError((this.structure.exchange.embed3_description).replace('{{amount}}', amount))
	
		let generate = Math.floor(Math.random() * 100);

		if(generate <= 75) {
			result.alphaCoins -= amount
			result.diamonds += Number.parseInt(Number(amount)/2)
			result.save();

			const embed = new MessageEmbed()
				.setColor(result ? result.color || this.config.botColor1 : this.config.botColor1)
				.setDescription((this.structure.exchange.embed5_description).replace('{{amount}}', amount).replace('{{amount2}}', Number.parseInt(Number(amount) /2)))
			return message.alphaReply({ embeds: [embed] })
		} else {
			let loss = Math.floor(Math.random() * (amount*5/6))

			result.alphaCoins = 0
			result.diamonds += Number.parseInt(Number(amount-loss)/2)

			result.save();

			const embed = new MessageEmbed()
				.setColor(this.config.botColor2)
				.setDescription((this.structure.exchange.embed6_description).replace('{{amount}}', loss).replace('{{amount2}}', Number.parseInt(Number(amount-loss)/2)))
				.setThumbnail('https://cdn.discordapp.com/attachments/766010028314066965/907427153681981520/Tumblr_l_1157959071725552.gif')
			return message.alphaReply({ embeds: [embed] })
		}
    }

	async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        const result = await this.client.schemas['user'].findById(interaction.user.id);

        focusedOption.value = focusedOption.value.replace(/[^0-9]/g, '')
        const amount = result.alphaCoins >= Number(focusedOption.value) ? focusedOption.value || '0' : String(result.alphaCoins)

        interaction.respond([
            { name: 'all', value: 'all' },
            { name: `${amount} A$`, value: amount }
        ]);
    }
}