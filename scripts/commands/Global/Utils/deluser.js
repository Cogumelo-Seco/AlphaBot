const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['deluser', 'cleardata', 'limpardados'];
        this.helpen = 'Clear all user data';
        this.help = 'Limpa todos os dados do usuário';
    }

    async run(message) {
        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription(`${message.user} ${this.structure.deluser.embed_description}`)

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

        msg.createMessageComponentCollector({ filter: i => i.user.id == message.user.id, time: 120000 })
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
            await i.deferUpdate()

            if (i.customId == 'yes') {
                this.client.schemas['user'].deleteOne({ _id: `${message.user.id}` }, async function (err) {
                    if (err) {
                        const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack
                        return message.alphaReplyError(`**[COMMAND] ERRO: \`\`\`js\n${errorMessage}\`\`\`**`)
                    }
                });
    
                let userResult2 = await this.client.schemas['user'].find({ marryID: message.user.id})
                if (userResult2 && userResult2.marryID) {
                    userResult2.marryID = 'off'
                    await userResult2.save()
                }
    
                this.client.schemas['rank'].deleteOne({ 
                    guildID: `${message.guild.id}`,
                    userID: `${message.user.id}` 
                }, async function (err) {
                    if (err) {
                        const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack
                        return message.alphaReplyError(`**[COMMAND] ERRO: \`\`\`js\n${errorMessage}\`\`\`**`)
                    }
                });
    
                embed
                    .setColor(this.config.botColor1)
                    .setDescription(this.structure.deluser.embed2_description)
                return msg.edit({ embeds: [embed], components: [] }).catch(() => null)
            } else {
                embed
                    .setColor(this.config.botColor2)
                    .setDescription(this.structure.deluser.embed3_description)
                return msg.edit({ embeds: [embed], components: [] }).catch(() => null)
            }
        })
    }
}