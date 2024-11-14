const Functions = require('../../../structures/functions/index');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para apostar',
                required: true,
                type: 6
            },
            {
                name: 'quantidade',
                description: 'Adicione uma quantidade para apostar',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['coinflip', 'bet', 'apostar'];
        this.helpen = 'Bet diamonds on a heads or tails with someone';
        this.help = 'Aposte diamantes num cara ou coroa com alguém';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985576206076358706/unknown.png'
        this.howToUsePT = '<usuário/id de usuário> <quantidade>'
        this.howToUseEN = '<user/userID> <amount>'
    }

    async run(message) {
        if (+new Date()-message.user.createdAt < 864000000) return message.alphaReplyError(this.events.commands.nodateuser)

		let user = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null)
        user = user ? user.user : null;

        if (!user) return message.alphaReplyError(this.events.commands.noidofmetion)

        if(user.id == message.user.id) return message.alphaReplyError(this.structure.coinflip.embed_description)

        if (user.bot) return message.alphaReplyError(this.structure.coinflip.embed2_description)

        const amount = Number(this.args[1])

        if(!amount) return message.alphaReplyError(this.structure.coinflip.embed3_description)

        if(amount == 0) return message.alphaReplyError(this.tructure.coinflip.embed3_description)

        const result = await this.client.schemas['user'].findById(user.id);
        const result2 = await this.client.schemas['user'].findById(message.user.id);

        if (!result) {
            const embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription((this.events.dbs.nouser).replace('{{user}}', user))
            return message.alphaReply({ embeds: [embed] })
        }

        if (amount > result2.diamonds) return message.alphaReplyError(this.structure.coinflip.embed4_description)
        if (amount > result.diamonds) return message.alphaReplyError(this.structure.coinflip.embed5_description.replace('{{user}}', user))

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription(`${user}, ${message.user} ${(this.structure.coinflip.embed6_description).replace('{{amount}}', amount).replace('{{author}}', message.user).replace('{{amount}}', amount)}`)
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('yes')
                    .setEmoji('✅')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('no')
                    .setEmoji('❌')
                    .setStyle('DANGER'),
            );

        let msg = await message.alphaReply({ content: `${user}`, embeds: [embed], components: [row] })
        if (!msg) return

        msg.createMessageComponentCollector({ filter: i => i.user.id == message.user.id, time: 60000 })
        .on('end', () => {
            let components = msg.components
            for (let i in components) {
                for (let a in components[i].components) {
                    if (components[i].components[a].setPlaceholder) components[i].components[a].setPlaceholder(this.events.commands.timeout)
                    components[i].components[a].setDisabled(true)
                }                
            }
            msg.edit({ components }).catch(() => null)
        })
        .on('collect', async (i) => {
            await i.deferUpdate();

            if (i.customId == 'yes') {
                let percent = Math.floor(Math.random() * 100);

                if (percent <= 50) {
                    let embed = new MessageEmbed()
                        .setColor(this.config.botColor1)
                        .setDescription((this.structure.coinflip.embed7_description).replace('{{amount}}', amount).replace('{{author}}', message.user).replace('{{user}}', user))

                    result.diamonds += amount
                    result2.diamonds -= amount
                    result2.save();
                    result.save();

                    return msg.edit({ embeds: [embed], components: [] }).catch(() => null)
                } else {
                    let embed = new MessageEmbed()
                        .setColor(this.config.botColor1)
                        .setDescription((this.structure.coinflip.embed8_description).replace('{{amount}}', amount).replace('{{author}}', message.user).replace('{{user}}', user))

                    result.diamonds -= amount
                    result2.diamonds += amount
                    result2.save();
                    result.save();

                    return msg.edit({ embeds: [embed], components: [] }).catch(() => null)
                }
            } else if (i.customId == 'no') {
                let embed = new MessageEmbed()
                    .setColor(this.config.botColor2)
                    .setDescription(`${message.user} **${this.structure.coinflip.embed9_description}**`)
                msg.edit({ embeds: [embed], components: [] }).catch(() => null)
            }
        })
	}
}