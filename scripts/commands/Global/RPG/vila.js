const Functions = require('../../../structures/functions/index');
const villageItems = require('../../../structures/configs/RPG/commands/village/items')
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.clientPermissionLevel = [26]
        this.name = ['village', 'vila'];
        this.help = 'Visite a vila para comprar itens e descansar';
        this.helpen = 'Visit the village to buy items and rest';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985560580624642128/unknown.png'
    }

    async run(message) {
		let player = await this.verifyRPGPlayer(message.user)

        let itemsToBuy = []
        let amount = ''
        let totalAmount = 0
        let cost = 0
        let list = ''
        let rowsSelectMenu = {}

        let userRPG = this.client.userRPG[message.user.id]
		if (!userRPG)  {
			this.client.userRPG[message.user.id] = {}
			userRPG = this.client.userRPG[message.user.id]
		}

        const rowSelectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('village--village')
                    .setPlaceholder(this.structure.village.placeSelection)
                    .addOptions([
						{
							label: this.structure.village.options._1.label,
							description: this.structure.village.options._1.description,
							value: '1',
						},
                        {
							label: this.structure.village.options._2.label,
							description: this.structure.village.options._2.description,
							value: '2',
						},
                        {
							label: this.structure.village.options._3.label,
							description: this.structure.village.options._3.description,
							value: '3',
						}
                    ]),
            );

        const embed = new MessageEmbed()
            .setThumbnail(message.user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || message.user.defaultAvatarURL)
            .setColor(this.config.botColor1)
            .setTitle(this.structure.village.embedTitle.replace('{{client}}', this.client.user.username))
            .setDescription(this.structure.village.embed)
        
        let msg = await message.alphaReply({ embeds: [embed], components: [rowSelectMenu] })
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
            await i.deferUpdate();

            const userResult = await this.client.schemas['user'].findById(message.user.id);
    
            let userRPG = this.client.userRPG[message.user.id]
            userRPG.villageItemAmount = 1
            if (!userRPG) return;
    
            const rowButtons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('village--return')
                        .setLabel('Home')
                        .setStyle('SECONDARY'),
                )
    
            if (i.customId == 'village--village') {
                if (i.values == '1') {
                    if (player.items.usable.length+player.items.unusable.length > 24) {
                        embed
                            .setTitle('')
                            .setThumbnail('')
                            .setColor(this.config.botColor2)
                            .setDescription(this.events.RPG.fullInventory)
                        return msg.edit({ embeds: [embed], components: [] }).catch(() => null)
                    }
                    
                    let rowSelectMenuWitchOptions = []
                    list = ''
    
                    for (let i in villageItems.witch) {
                        let item = villageItems.witch[i]
    
                        rowSelectMenuWitchOptions.push({
                            label: `${Number(i)+1}º - ${this.structure.type == 'pt-BR' ? item.name : item.name_EN}`,
                            description: this.structure.type == 'pt-BR' ? item.description : item.description_EN || 'p-p',
                            value: `${item.name}--witch`
                        })
                        list += `**\`${Number(i)+1}º\` - ${this.structure.type == 'pt-BR' ? item.name : item.name_EN}** - **\`${item.cost} 💎\`**\n`
                    }
    
                    rowsSelectMenu.witch = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('witch-items')
                                .setMaxValues(villageItems.witch.length)
                                .setPlaceholder(this.structure.village.selectTheItem)
                                .addOptions(rowSelectMenuWitchOptions),
                        );
    
                    this.editMsg('witch', { msg, embed, list, amount, row: rowsSelectMenu.witch, totalAmount, cost })
                } else if (i.values == '2') {
                    if (player.items.usable.length+player.items.unusable.length > 24) {
                        embed
                            .setTitle('')
                            .setThumbnail('')
                            .setColor(this.config.botColor2)
                            .setDescription(this.events.RPG.fullInventory)
                        return msg.edit({ embeds: [embed], components: [] }).catch(() => null)
                    }
    
                    let rowSelectMenuBlacksmithOptions = []
                    list = ''
    
                    for (let i in villageItems.blacksmith) {
                        let item = villageItems.blacksmith[i]
    
                        if (player.items.equipped.find(i => i.type == item.type && i.category == item.category-1) || !player.items.equipped.find(i => i.type == item.type) && item.category == 1) {
                            rowSelectMenuBlacksmithOptions.push({
                                label: this.structure.type == 'pt-BR' ? item.name : item.name_EN,
                                description: this.structure.type == 'pt-BR' ? item.description : item.description_EN || 'p-p',
                                value: `${item.name}--blacksmith`
                            })
                            let requiredItemsList = ''
                            for (let i in item.requiredItems) {
                                let requiredItem = item.requiredItems[i]
                                requiredItemsList += `\`${requiredItem.amount} - ${this.structure.type == 'pt-BR' ? requiredItem.name : requiredItem.name_EN}\` `
                            }
                            list += `**\`lv ${item.category}\` - ${this.structure.type == 'pt-BR' ? item.name : item.name_EN}** - **\`${item.cost} 💎\`**\n${this.structure.type == 'pt-BR' ? 'Itens necessários' : 'Required items'}:\n${requiredItemsList}\n\n\n`
                        }
                    }

                    if (!rowSelectMenuBlacksmithOptions[0]) {
                        embed
                            .setColor(this.config.botColor2)
                            .setTitle('')
                            .setThumbnail('')
                            .setDescription(this.structure.village.nothingToBuy)
                        msg.edit({ embeds: [embed], components: [rowButtons] }).catch(() => null)
                    }
    
                    rowsSelectMenu.blacksmith = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('blacksmith--purchase')
                                .setPlaceholder(this.structure.village.selectTheItem)
                                .addOptions(rowSelectMenuBlacksmithOptions),
                        );
    
                    embed
                        .setColor(this.config.botColor1)
                        .setTitle(this.structure.village.embedBlacksmithTitle)
                        .setDescription(`${this.structure.village.itemPurchaseAlert}\n\n${list}`)
                    msg.edit({ embeds: [embed], components: [rowsSelectMenu.blacksmith, rowButtons] }).catch(() => null)
                } else if (i.values == '3') {
                    if (+new Date() < Number(player.rest.split('-')[0]) && player.rest.split('-')[1] == 'rest') {
                        embed
                            .setTitle('')
                            .setThumbnail('')
                            .setColor(this.config.botColor2)
                            .setDescription(this.structure.village.resting)
                        return msg.edit({ embeds: [embed], components: [rowButtons] }).catch(() => null)
                    }
    
                    rowsSelectMenu.hotel = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('village--hotel')
                                .setPlaceholder(this.structure.village.selectOption)
                                .addOptions([
                                    {
                                        label: this.structure.village.hotelOptions._1.label,
                                        description: this.structure.village.hotelDescriptions.replace('{{HP}}', Math.floor(player.totalLife*0.25)).replace('{{mana}}', Math.floor(player.totalMana*0.25)),
                                        value: `afternoon--hotel`
                                    },
                                    {
                                        label: this.structure.village.hotelOptions._2.label,
                                        description: this.structure.village.hotelDescriptions.replace('{{HP}}', Math.floor(player.totalLife*0.5)).replace('{{mana}}', Math.floor(player.totalMana*0.5)),
                                        value: `little--hotel`
                                    },
                                    {
                                        label: this.structure.village.hotelOptions._3.label,
                                        description: this.structure.village.hotelDescriptions.replace('{{HP}}', Math.floor(player.totalLife*0.75)).replace('{{mana}}', Math.floor(player.totalMana*0.75)),
                                        value: `big--hotel`
                                    },
                                    {
                                        label: this.structure.village.hotelOptions._4.label,
                                        description: this.structure.village.hotelDescriptions.replace('{{HP}}', Math.floor(player.totalLife*1)).replace('{{mana}}', Math.floor(player.totalMana*1)),
                                        value: `hibernation--hotel`
                                    }
                                ]),
                        );
    
                    embed
                        .setColor(this.config.botColor1)
                        .setTitle(this.structure.village.embedHotelTitle)
                        .setDescription(this.structure.village.embedHotel)
                    msg.edit({ embeds: [embed], components: [rowsSelectMenu.hotel, rowButtons] }).catch(() => null)
                }
            } else if (i.customId == 'blacksmith--purchase') {
                let itens = ''
                cost = 0

                for (let a in i.values) {
                    let itemName = i.values[a].split('--')[0]                    
                    let item = villageItems.blacksmith.find(i => i.name == itemName)
                    cost += item.cost
                    itens += `\`${this.structure.type == 'pt-BR' ? item.name : item.name_EN}\`\n`
                }

                if (userResult.diamonds < cost) {
                    embed
                        .setColor(this.config.botColor2)
                        .setTitle('')
                        .setThumbnail('')
                        .setDescription(this.structure.village.withoutMoney)
                    return msg.edit({ embeds: [embed], components: [rowButtons] }).catch(() => null)
                }

                for (let a in i.values) {
                    let itemName = i.values[a].split('--')[0]                    
                    let item = villageItems.blacksmith.find(i => i.name == itemName)

                    let requiredItems = ''
                    for (let i in item.requiredItems) {
                        let requiredItem = item.requiredItems[i]
                        let playerItem = player.items.unusable.find(i => i.name == requiredItem.name)
                        if (playerItem && playerItem.amount < requiredItem.amount) requiredItems += `\`${requiredItem.amount-playerItem.amount} - ${this.structure.type == 'pt-BR' ? requiredItem.name : requiredItem.name_EN}\` `
                    }
    
                    if (requiredItems != '') {
                        embed
                            .setTitle('')
                            .setThumbnail('')
                            .setColor(this.config.botColor2)
                            .setDescription(this.structure.village.noItems.replace('{{requiredItems}}', requiredItems))
                        return msg.edit({ embeds: [embed], components: [rowButtons] }).catch(() => null)
                    }
    
                    for (let i in item.requiredItems) {
                        let requiredItem = item.requiredItems[i]
                        let requiredItemPlayer = player.items.unusable.find(i => i.name == requiredItem.name && i.amount >= requiredItem.amount)
                        if (player.items.unusable[player.items.unusable.indexOf(requiredItemPlayer)]) {
                            if (player.items.unusable[player.items.unusable.indexOf(requiredItemPlayer)].amount-requiredItem.amount <= 0) player.items.unusable.splice(player.items.unusable[player.items.unusable.indexOf(requiredItemPlayer)], 1)
                            else player.items.unusable[player.items.unusable.indexOf(requiredItemPlayer)].amount -= requiredItem.amount                            
                        }
                    }

                    let playerInferiorItem = player.items.equipped.find(i => i.type == item.type && i.category == item.category-1)
                    if (playerInferiorItem) player.items.equipped.splice(player.items.equipped.indexOf(playerInferiorItem), 1)
                    player.items.equipped.push(item)
    
                    let power = item.power
                    if (power.attack) player.attack += power.attack
                    if (power.totalLife) player.totalLife += power.totalLife
                    if (power.totalMana) player.totalMana += power.totalMana
                }

                userResult.diamonds -= cost
                let XP = Math.floor(Math.random()*20)+10
                await player.addXP(XP, player)

                this.editMsg('successfulPurchase', { msg, embed, itens, cost, category: 'blacksmith', row: rowButtons })
            } else if (i.customId == 'witch--purchase') {
                if (Number(amount) <= 0 || itemsToBuy.length <= 0) return

                if (userResult.diamonds < cost) {
                    embed
                        .setColor(this.config.botColor2)
                        .setTitle('')
                        .setThumbnail('')
                        .setDescription(this.structure.village.withoutMoney)
                    return msg.edit({ embeds: [embed], components: [rowButtons] }).catch(() => null)
                }

                let itens = ''

                for (let a in itemsToBuy) {
                    let item = itemsToBuy[a]
                    let itemName = itemsToBuy[a].name
                    let playerItem = player.items.usable.find(i => i.name == itemName)
                    itens += `\`${amount} - ${this.structure.type == 'pt-BR' ? item.name : item.name_EN}\` `

                    if (!playerItem) {
                        player.items.usable.push(item)
                        player.items.usable[player.items.usable.indexOf(item)].amount += Number(amount) > 1 ? Number(amount)-1 : 0
                    } else player.items.usable[player.items.usable.indexOf(playerItem)].amount += Number(amount)
                }

                userResult.diamonds -= cost
                let XP = Math.floor(Math.random()*20)+10
                await player.addXP(XP, player)

                this.editMsg('successfulPurchase', { msg, embed, itens, cost, category: 'witch', row: rowButtons })
            } else if (i.customId == 'village--hotel') {
                let itemName = i.values[0].split('--')[0]
                let rest = 0
                let life = 0
                let mana = 0
                
                switch(itemName) {
                    case 'afternoon':
                        rest = 3600000
                        life = Math.floor(player.totalLife*0.25)
                        mana = Math.floor(player.totalMana*0.25)
                        break
                    case 'little':
                        rest = 10800000
                        life = Math.floor(player.totalLife*0.5)
                        mana = Math.floor(player.totalMana*0.5)
                        break
                    case 'big':
                        rest = 18000000
                        life = Math.floor(player.totalLife*0.75)
                        mana = Math.floor(player.totalMana*0.75)
                        break
                    case 'hibernation':
                        rest = 28800000
                        life = player.totalLife
						mana = player.totalMana
                        break
                }
    
                if (player.life+life >= player.totalLife) player.life = player.totalLife
                else player.life += life
                if (player.mana+mana >= player.totalMana) player.mana = player.totalMana
                else player.mana += mana
                player.rest = `${+new Date()+rest}-rest`
    
                embed
                    .setTitle('')
                    .setThumbnail('')
                    .setColor(this.config.botColor1)
                    .setDescription(this.structure.village.embedHotelRest
                        .replace('{{time}}', (this.client.moment.duration(rest, "milliseconds")).hours())
                    )
                msg.edit({ embeds: [embed], components: [rowButtons] }).catch(() => null)
            } else if (i.customId == 'village--return') {
                cost = 0
                totalAmount = 0
                amount = ''

                embed
                    .setThumbnail(message.user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || message.user.defaultAvatarURL)
                    .setColor(this.config.botColor1)
                    .setTitle(this.structure.village.embedTitle.replace('{{client}}', this.client.user.username))
                    .setDescription(this.structure.village.embed)
                msg.edit({ embeds: [embed], components: [rowSelectMenu] }).catch(() => null)
            } else if (i.customId == 'witch-items') {
                cost = 0
                itemsToBuy = []
                for (let a in i.values) {
                    let itemName = i.values[a].split('--')[0]                    
                    let item = villageItems.witch.find(i => i.name == itemName)

                    itemsToBuy.push(item)
                    cost += Number(amount)*item.cost
                }
                totalAmount = Number(amount)*itemsToBuy.length

                this.editMsg('witch', { msg, embed, list, amount, row: rowsSelectMenu.witch, totalAmount, cost })
            } else if (Number(i.customId) >= 0 || i.customId == 'del') {
                if (i.customId == 'del') amount = amount.slice(0, amount.length-1)
                else amount += i.customId
                cost = 0
                totalAmount = Number(amount)*itemsToBuy.length
                for (let a in itemsToBuy) {
                    let item = itemsToBuy[a]
                    cost += Number(amount)*item.cost
                }

                this.editMsg('witch', { msg, embed, list, amount, row: rowsSelectMenu.witch, totalAmount, cost })
            }
 
            userResult.RPGPlayer = player
            await userResult.save()
        })
    }

    async editMsg(type, { msg, embed, list, amount, cost, totalAmount, row, category, itens }) {
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
                new MessageButton()
                    .setCustomId('village--return')
                    .setLabel('Home')
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
                    .setCustomId('witch--purchase')
                    .setLabel('Buy')
                    .setStyle('SUCCESS'),
            )

        if (type == 'witch') {
            embed
                .setColor(this.config.botColor1)
                .setTitle(this.structure.village.embedWitchTitle)
                .setDescription(`${this.structure.village.itemPurchaseAlert}\n\n${list}\n${this.structure.village.purchaseAmount
                    .replace('{{amount}}', amount || 0)
                    .replace('{{cost}}', cost)
                    .replace('{{totalAmount}}', totalAmount)}
                `)
            msg.edit({ embeds: [embed], components: [row, rowButtons1, rowButtons2, rowButtons3, rowButtons4] }).catch(() => null)
        } else if (type == 'successfulPurchase') {
            embed
                .setColor(this.config.botColor1)
                .setTitle('')
                .setThumbnail('')
                .setDescription(this.structure.village.successfulPurchase[category]
                    .replace('{{itemName}}', itens)
                    .replace('{{cost}}', cost)
                )
            msg.edit({ embeds: [embed], components: [row] }).catch(() => null)
        }
    }
}