const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');


function getSlots(length) {
    const multipliers = [
		{
			2: 1.2,
			3: 1.5
		},
        {
			2: 1.4,
			3: 1.9
		},
		{
			2: 1.6,
			3: 2
		},
		{
			2: 2.2,
			3: 2.3
		},
		{
			2: 2.4,
			3: 2.8
		},
		{
			2: 2.9,
			3: 3
		}
	];

    const slots = {
        1: Math.floor(Math.random() * length),
        2: Math.floor(Math.random() * length),
        3: Math.floor(Math.random() * length)
    }
    const result = {
        slots: {
            1: slots[1],
            2: slots[2],
            3: slots[3],
        },
        total: 0,
    };

    if (slots[1] == slots[2] && slots[1] == slots[3]) {
        result.total = 13
    } else if (slots[1] == slots[2] || slots[1] == slots[3]) {
        result.total = multipliers[slots[1]][2];
    } else if (slots[2] == slots[3]) {
        result.total = multipliers[slots[2]][2];
    }

    return result;
}

module.exports = class extends Functions {
    constructor(props) {
        super(props);


		this.slashOptions =  [
            {
                name: 'quantidade',
                description: 'Adicione uma quantidade para apostar (maior que 1000 e menor que 20000)',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['slotmachine', 'slot', 'caçaniquel', 'cacaniquel', 'caça-niquel', 'caca-niquel'];
        this.helpen = 'Bet on the Alpha slot machine';
        this.help = 'Aposte no Caça-Níquel do Alpha';
		this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985575509293412402/unknown.png'		
		this.howToUsePT = '<quantidade>'
        this.howToUseEN = '<amount>'
    }

    async run(message) {
        if (+new Date()-message.user.createdAt < 864000000) return message.alphaReplyError(this.events.commands.nodateuser)

		const user = await this.client.schemas['user'].findById(message.user.id);
		const amount = Number(this.args[0])

		if (!amount || amount < 1000 || amount > 20000) return message.alphaReplyError(this.structure.slot.invalidAmount)
		if (amount > user.diamonds) return message.alphaReplyError(this.structure.slot.noDiamonds)

		const options = ['🍌', '🍒', '🍎', '🍇', '7️⃣', '💎']
	
		const result = getSlots(options.length);
		if (!result) {
            embed 
                .setColor(this.config.botColor2)
                .setDescription(this.events.dbs.noauthor)
            return interaction.alphaReply({ embeds: [embed] })
        }

		const lines = {
			1: `${options[result.slots[1]-1] || options[options.length-1]} ┃ ${options[result.slots[2]-1] || options[options.length-1]} ┃ ${options[result.slots[3]-1] || options[options.length-1]}`,
			2: `${options[result.slots[1]]} ┃ ${options[result.slots[2]]} ┃ ${options[result.slots[3]]}`,
			3: `${options[result.slots[1]+1] || options[0]} ┃ ${options[result.slots[2]+1] || options[0]} ┃ ${options[result.slots[3]+1] || options[0]}`
		}

		const linesFormat = `${lines[1]}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n${lines[2]}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n${lines[3]}`

		const embed = new MessageEmbed()
			.setTitle(this.structure.slot.embed_title)
			.setThumbnail(message.user.avatarURL({ dynamic: true, format: "png", size: 2048 }) || message.user.defaultAvatarURL)

		if (result.total == 13){
			const value = (Math.floor(amount * 3));
			user.diamonds += value
			embed
				.setDescription(`**\`\`\`${linesFormat}\`\`\`\n${this.structure.slot.winMax} \`${value} 💎\`**`)
				.setColor(user.color || this.config.botColor1)
		} else if (result.total == 0){
			const valueLost = Math.floor(Math.random() * 2)+1;
			const value = (Math.floor(amount * 2 / valueLost));
			user.diamonds -= value
			embed
				.setColor(this.config.botColor2)
				.setDescription(`**\`\`\`${linesFormat}\`\`\`\n${this.structure.slot.lose} \`${value} 💎\`**`)
		} else {
			const value = Math.floor(result.total * amount);
			user.diamonds += value
			embed
				.setColor(user.color || this.config.botColor1)
				.setDescription(`**\`\`\`${linesFormat}\`\`\`\n${this.structure.slot.win} \`${value} 💎\`**`)
		}

		user.save()
		return message.alphaReply({ embeds: [embed] })
    }
}