const Functions = require('../../../structures/functions/index');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para ver o inventário dele',
                type: 6
            }
        ];
        this.clientPermissionLevel = [26]
        this.name = ['inventário', 'inventory', 'inv'];
        this.help = 'Veja o que você tem em seu inventário ou o de outra pessoa';
        this.helpen = 'See what you have in your inventory or someone else\'s';
        this.howToUsePT = '[usuário/id de usuário]'
        this.howToUseEN = '[user/userID]'
    }

    async run(message) {
        let user = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => message.user)

		let player = await this.verifyRPGPlayer(user) 

        let listEquipped = ''
        let listUsable = ''
        let listUnusable = ''

        for (let i in player.items.equipped) {
            let item = player.items.equipped[i]
            listEquipped += `**${Number(i)+1}º** - ${this.structure.type == 'pt-BR' ? item.name : item.name_EN}\n`
        }

        for (let i in player.items.usable) {
            let item = player.items.usable[i]
            listUsable += `**${Number(i)+1}º** - ${this.structure.type == 'pt-BR' ? item.name : item.name_EN} - \`${item.amount}\`\n`
        }

        for (let i in player.items.unusable) {
            let item = player.items.unusable[i]
            listUnusable += `**${Number(i)+1}º** - ${this.structure.type == 'pt-BR' ? item.name : item.name_EN} - \`${item.amount}\`\n`
        }
        
        let rowItemsOptions = []
        for (let i in player.items.unusable) rowItemsOptions.push({
            label: this.structure.type == 'pt-BR' ? player.items.unusable[i].name : player.items.unusable[i].name_EN,
            description: this.structure.type == 'pt-BR' ? `Vender item: ${player.items.unusable[i].price || 13} 💎` : `Sell item: ${player.items.unusable[i].price || 13} 💎`,
            value: player.items.unusable[i].name
        })

        const rowItemskSelectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('selectItem')
                    .setPlaceholder(this.structure.inventory.itemSelectionToSell)
                    .addOptions(rowItemsOptions),
            );

        let components = []
        if (rowItemsOptions[0] && user.id == message.user.id) components.push(rowItemskSelectMenu)

        const embed = new MessageEmbed()
            .setThumbnail('https://cdn.discordapp.com/attachments/766010028314066965/907426437911412757/image2-1.gif')
            .setColor(this.config.botColor1)
            .setTitle(`${this.structure.type == 'pt-BR' ? 'Inventário de' : 'Inventory of'} ${user.username}`)
            .setDescription(this.structure.inventory.embed                
                .replace('{{listEquipped}}', listEquipped == '' ? this.structure.inventory.clean : listEquipped)
                .replace('{{listUsable}}', listUsable == '' ? this.structure.inventory.clean : listUsable)
                .replace('{{listUnusable}}', listUnusable == '' ? this.structure.inventory.clean : listUnusable)
            )

        let msg = await message.alphaReply({ embeds: [embed], components })
        if (!msg) return
        let amount = ''
        let itemName = null

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

            const userResult = await this.client.schemas['user'].findById(message.user.id);

            if (!itemName) itemName = i.values[0]

            let playerItem = player.items.unusable.find(i => i.name == itemName)
            
            if (i.customId == 'selectItem') {
                this.edit(msg, message, embed, amount, playerItem)
            } else if (i.customId == 'del') {
                amount = amount.slice(0, amount.length-1)
                this.edit(msg, message, embed, amount, playerItem)
            } else if (i.customId == 'yes') {
                let amount2 = playerItem.amount <= Number(amount) ? playerItem.amount : Number(amount)

                if (amount2 <= 0) {
                    embed
                        .setTitle('')
                        .setThumbnail('')
                        .setColor(this.config.botColor2)
                        .setDescription(this.structure.inventory.noSale)
                    msg.edit({ embeds: [embed], components: [] }).catch(() => null)
                } else {
                    embed
                        .setTitle('')
                        .setThumbnail('')
                        .setColor(this.config.botColor1)
                        .setDescription(this.structure.inventory.sold
                            .replace('{{amount}}', amount2)
                            .replace('{{itemName}}', this.structure.type == 'pt-BR' ? playerItem.name : playerItem.name_EN)
                            .replace('{{itemPrice}}', (playerItem.price || 13)*amount2 || 0)
                        )
                    msg.edit({ embeds: [embed], components: [] }).catch(() => null)
                        
                    if (playerItem.amount <= Number(amount2)) player.items.unusable.splice(player.items.unusable.indexOf(playerItem), 1)
                    else player.items.unusable[player.items.unusable.indexOf(playerItem)].amount -= Number(amount2)

                    userResult.diamonds += (playerItem.price || 13)*amount2 || 0
                    await player.addXP(Number.parseInt(playerItem.price*amount2/2) || 1, player)
                }
            } else {
                amount += i.customId
                this.edit(msg, message, embed, amount, playerItem)
            }

            userResult.RPGPlayer = player
            await userResult.save()
        })
    }

    edit(msg, message, embed, amount, item) {
        const rowButtons1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('1')
                    .setLabel('1')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('2')
                    .setLabel('2')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('3')
                    .setLabel('3')
                    .setStyle('SECONDARY'),
			)
        const rowButtons2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('4')
                    .setLabel('4')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('5')
                    .setLabel('5')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('6')
                    .setLabel('6')
                    .setStyle('SECONDARY'),
			)
        const rowButtons3 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('7')
                    .setLabel('7')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('8')
                    .setLabel('8')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('9')
                    .setLabel('9')
                    .setStyle('SECONDARY'),
            )
        const rowButtons4 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('del')
                    .setLabel('Del')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('0')
                    .setLabel('0')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('yes')
                    .setEmoji('✅')
                    .setStyle('SUCCESS'),
            )

        embed
            .setThumbnail('')
            .setColor(this.config.botColor1)
            .setTitle(this.structure.inventory.embedSaleTitle
                .replace('{{amount}}', amount || 0)    
            )
            .setDescription(this.structure.inventory.embedSale
                .replace('{{itemName}}', this.structure.type == 'pt-BR' ? item.name : item.name_EN)
                .replace('{{itemPrice}}', (item.price || 13)*amount || 0)
            )
        msg.edit({ embeds: [embed], components: [rowButtons1, rowButtons2, rowButtons3, rowButtons4] }).catch(() => null)
    }
}