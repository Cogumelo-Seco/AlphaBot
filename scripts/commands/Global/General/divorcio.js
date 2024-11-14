const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26, 22]
        this.name = ['divórcio', 'divorce', 'divorcio'];
        this.helpen = 'Divorcing someone';
        this.help = 'Divorciar-se de alguém';
    }

    async run(message) {
        const result = await this.client.schemas['user'].findById(message.user.id);

        if (result.marryID == 'off') return message.alphaReplyError(this.structure.divorce.noMarried)

        let user = (await message.guild.members.fetch(result.marryID).catch(() => null))?.user

        if (!user) return message.alphaReplyError(this.structure.divorce.noGuild)

        const result2 = await this.client.schemas['user'].findById(user.id);

        if (!result2) {
            const embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription((this.events.dbs.nouser).replace('{{user}}', user))
            return message.alphaReply({ embeds: [embed] })
        }

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription((this.structure.divorce.embed_description).replace('{{user}}', user).replace('{{author}}', message.user))

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

        let msg = await message.alphaReply({ embeds: [embed], components: [row] })
        if (!msg) return

        const yes = message.channel.createMessageComponentCollector({ filter: i => i.customId === 'yes' && i.user.id == user.id, time: 60000 });
        const no = message.channel.createMessageComponentCollector({ filter: i => i.customId === 'no' && i.user.id == user.id, time: 60000 });

        let interval = setTimeout(() => {
            const newembed = msg.embeds[0]
            const timeout = new MessageEmbed(newembed)
                .setColor(this.config.botColor2)
                .setDescription(`${message.user} **${this.events.dbs.timeout}**`)
            msg.edit({ embeds: [timeout] }).catch(() => null)
            msg.reactions.removeAll().catch(() => null)
        }, 60000);

        yes
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

            clearInterval(interval)

            const embed2 = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setDescription((this.structure.divorce.embed2_description).replace('{{user}}', user).replace('{{author}}', message.user))
            msg.edit({ embeds: [embed2] }).then().catch(() => null)

            msg.reactions.removeAll().then().catch(() => null)
        
            result.marryID = "off"
            result2.marryID = "off"
            result.save();
            result2.save();
        })

        no
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

            clearInterval(interval)

            const inf2 = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription((this.structure.divorce.embed3_description).replace('{{user}}', user).replace('{{author}}', message.user))
            msg.edit({ content: `${message.user}`, embeds: [inf2] }).then().catch(() => null)
            return msg.reactions.removeAll().then().catch(() => null)
        })
    }
}