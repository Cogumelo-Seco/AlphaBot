const Functions = require('../../../structures/functions/index');
const RPGMonsters = require('../../../structures/configs/RPG/monsters');
const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton, MessageAttachment } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.clientPermissionLevel = [26]
        this.name = ['dungeon', 'masmorra'];
        this.help = 'Entre em uma dungeon e destrua monstros e torne-se forte!';
        this.helpen = 'Enter a dungeon and destroy monsters and become strong!';
		this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985341789680594964/unknown.png'
    }

    async run(message) {
		let player = await this.verifyRPGPlayer(message.user)

		let dungeonStrength = {}
		for (let i in RPGMonsters) {
			for (let a in RPGMonsters[i]) {
				if (!dungeonStrength[i]) dungeonStrength[i] = []
				dungeonStrength[i].push(Number.parseInt((RPGMonsters[i][a].attack+RPGMonsters[i][a].life)/2))
			}
			dungeonStrength[i].sort((a, b) => a-b)
		}

		let userRPG = this.client.userRPG[message.user.id]
		if (!userRPG)  {
			this.client.userRPG[message.user.id] = {}
			userRPG = this.client.userRPG[message.user.id]
		}

		if (+new Date() < Number(player.rest.split('-')[0])) return message.alphaReplyError(this.events.RPG.rest.replace('{{time}}', `<t:${Number.parseInt(Number(player.rest.split('-')[0])/1000)}:R>`))

		let rowAtackOptions = []
		for (let i in player.attacks) rowAtackOptions.push({
			label: player.attacks[i].name,
			description: `${this.structure.type == 'pt-BR' ? '⚔️ Dano' : '⚔️ Damage'}: ${Number.parseInt(player.attack*player.attacks[i].damage || player.attack)}, 🔥 Mana: ${Number.parseInt(player.attack*(player.attacks[i].damage/3))}`,
			value: i
		})

		let attachment = new MessageAttachment(await this.canvasImages.RPGPlayerStatus(player), `img.png`)

		const embed = new MessageEmbed()
			.setColor(this.config.botColor1)
			.setDescription(this.structure.dungeon.embed)
			.setImage(`attachment://img.png`)
			.setThumbnail(message.user.avatarURL({ dynamic: true, format: "png", size: 2048 }) || message.user.defaultAvatarURL)

        const rowSelectMenu = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('dungeon--dungeon')
					.setPlaceholder(this.structure.dungeon.dungeonSelection)
					.addOptions([
						{
							label: '🚪 | Dungeon 1',
							description: `⚔️: ${dungeonStrength[0][0]}-${dungeonStrength[0][dungeonStrength[0].length-1]}`,
							value: '1',
						},
						{
							label: '🚪 | Dungeon 2',
							description: `⚔️: ${dungeonStrength[1][0]}-${dungeonStrength[1][dungeonStrength[1].length-1]}`,
							value: '2',
						},
						{
							label: '🚪 | Dungeon 3',
							description: `⚔️: ${dungeonStrength[2][0]}-${dungeonStrength[2][dungeonStrength[2].length-1]}`,
							value: '3',
						},
						{
							label: '🚪 | Dungeon 4',
							description: `⚔️: ${dungeonStrength[3][0]}-${dungeonStrength[3][dungeonStrength[3].length-1]}`,
							value: '4',
						},
						{
							label: '🚪 | Dungeon 5',
							description: `⚔️: ${dungeonStrength[4][0]}-${dungeonStrength[4][dungeonStrength[4].length-1]}`,
							value: '5',
						},
					]),
			);

		const rowAtackSelectMenu = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('dungeon--selectAtack')
					.setPlaceholder(this.structure.dungeon.attackSelection)
					.addOptions(rowAtackOptions),
			);
		const rowButtons = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('dungeon--run')
					.setLabel(this.structure.dungeon.run)
                    .setStyle('DANGER'),
				new MessageButton()
                    .setCustomId('dungeon--useItems')
                    .setEmoji('📖')
                    .setStyle('SECONDARY'),
			)

		
		let msg;
		if (userRPG.monster) {
			embed
				.setTitle('')
				.setColor(this.config.botColor1)
				.setThumbnail(userRPG.monster.image || message.user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || message.user.defaultAvatarURL)
				.setDescription(this.structure.dungeon.embedDungeon
					.replace('{{monsterName}}', userRPG.monster.name)
					.replace('{{monsterLife}}', userRPG.monster.life)
					.replace('{{monsterAttack}}', userRPG.monster.attack)
				)
			msg = await message.alphaReply({ embeds: [embed], components: [rowAtackSelectMenu, rowButtons], files: [attachment] });
		} else msg = await message.alphaReply({ embeds: [embed], components: [rowSelectMenu], files: [attachment] });
		if (!msg) return

		msg?.createMessageComponentCollector({ filter: i => i.user.id == message.user.id, time: 120000 })
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

			const rowButtonsItensMenu = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('dungeon--run')
						.setLabel(this.structure.dungeon.run)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('dungeon--returnToBattle')
						.setEmoji('◀️')
						.setStyle('SECONDARY'),
				)

			let userRPG = this.client.userRPG[message.user.id]
			if (!userRPG) return;

			if (i.customId == 'dungeon--dungeon') {
				let monster = RPGMonsters[Number(i.values)-1][Number.parseInt(Math.random() * (RPGMonsters[Number(i.values)-1].length))]
				userRPG.monsterProps = monster
				userRPG.monster = {}
				for (let i in monster) userRPG.monster[i] = monster[i]

				this.editMsg('battle', { msg, embed, player, userRPG, components: [rowAtackSelectMenu, rowButtons] })
			} else if (i.customId == 'dungeon--selectAtack') {
				let attack = player.attacks[Number(i.values)]
				let playerDamage = player.mana >= Number.parseInt(player.attack*(attack.damage/3)) ? Number.parseInt(player.attack*attack.damage-Number.parseInt(Math.random() * (player.attack*attack.damage / 10))) || Number.parseInt(player.attack) : null
				let monsterDamage = userRPG.monster.attack-Number.parseInt(Math.random() * (userRPG.monster.attack / 10))

				if (playerDamage) userRPG.monster.life -= playerDamage
				if (player.mana >= Number.parseInt(player.attack*(attack.damage/3))) player.mana -= Number.parseInt(player.attack*(attack.damage/3))
				player.life -= monsterDamage

				if (userRPG.monster.life <= 0) {
					delete this.client.userRPG[message.user.id]
					player.life += monsterDamage

					let monster = userRPG.monsterProps
					let item = userRPG.monster.drops[Number.parseInt(Math.random() * (userRPG.monster.drops.length))]
					let xp = Number.parseInt((Math.random() * ((monster.life+monster.attack) /2))*2)+1
					let fullInventory = player.items.usable.length+player.items.unusable.length > 24

					await player.addXP(xp, player)

					if (!fullInventory) {
						let playerItem = player.items[item.usable ? 'usable' : 'unusable'].find(i => i.name == item.name)
						if (playerItem) player.items[item.usable ? 'usable' : 'unusable'][player.items[item.usable ? 'usable' : 'unusable'].indexOf(playerItem)].amount += item.amount
						else player.items[item.usable ? 'usable' : 'unusable'].push(item)
					}

					embed
						.setColor(this.config.botColor1)
						.setThumbnail('https://cdn.discordapp.com/attachments/784557596580904981/983901869632012288/won.png')
						.setTitle(this.structure.dungeon.embedWonTitle)
						.setDescription(fullInventory ? this.events.RPG.fullInventory : this.structure.dungeon.embedWon
							.replace('{{itemAmount}}', item.amount)
							.replace('{{item}}', this.structure.type == 'pt-BR' ? item.name : item.name_EN)
							.replace('{{XP}}', xp)
						)
						msg.edit({ embeds: [embed], components: [], files: [] }).catch(() => null)
				} else if (player.life <= 0) {
					delete this.client.userRPG[message.user.id]

					player.rest = `${+new Date()+43200000}-rest`
					player.life = player.totalLife
					player.mana = player.totalMana

					embed
						.setColor(this.config.botColor2)
						.setThumbnail('https://cdn.discordapp.com/attachments/784557596580904981/983901869262925864/lost.png')
						.setTitle(this.structure.dungeon.embedDeadTitle)
						.setDescription(this.structure.dungeon.embedDead)
					msg.edit({ embeds: [embed], components: [], files: [] }).catch(() => null)
				}  else this.editMsg('battle', { msg, embed, player, userRPG, components: [rowAtackSelectMenu, rowButtons], 
					content:  this.structure.dungeon[playerDamage ? 'embedDungeon2' : 'embedDungeon3'].replace(/{{playerDamage}}/g, playerDamage).replace(/{{monsterDamage}}/g, monsterDamage)
				})

				if (player.life < 0) player.life = 0
				if (player.mana < 0) player.mana = 0
			} else if (i.customId == 'dungeon--run') {
				delete this.client.userRPG[message.user.id]

				player.rest = `${+new Date()+900000}-run`

				const embed2 = new MessageEmbed()
					.setColor(this.config.botColor2)
					.setTitle(this.structure.dungeon.embedRunTitle)
					.setDescription(this.structure.dungeon.embedRun)
				msg.edit({ embeds: [embed2], components: [], files: [] }).catch(() => null)
			} else if (i.customId == 'dungeon--useItems') {
				let list = ''
				let rowItensMenuOptions = []
				for (let i in player.items.usable) {
					let item = player.items.usable[i]

					if (item.type == 'regenerate') {
						rowItensMenuOptions.push({
							label: this.structure.type == 'pt-BR' ? item.name : item.name_EN,
							description: this.structure.type == 'pt-BR' ? item.description : item.description_EN || 'p-p',
							value: item.name
						})
						list += `\`${item.amount}\` - **${this.structure.type == 'pt-BR' ? item.name : item.name_EN}** - **${item.power.life > 0 ? `❤️: \`${item.power.life}\`` : ''}  ${item.power.mana > 0 ? `🔥: \`${item.power.mana}\`` : ''}**\n`
					}
				}

				let rowSelectMenuItensMenu = new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId('dungeon--selectItem')
							.setPlaceholder(this.structure.dungeon.itemSelection)
							.addOptions(rowItensMenuOptions),
					);
				let components = []
				if (rowItensMenuOptions[0]) components.push(rowSelectMenuItensMenu)
				components.push(rowButtonsItensMenu)

				this.editMsg('selectItem', { msg, embed, player, list, components })
			} else if (i.customId == 'dungeon--returnToBattle') {
				this.editMsg('battle', { msg, embed, player, userRPG, components: [rowAtackSelectMenu, rowButtons] })
			} else if (i.customId == 'dungeon--selectItem') {
				let itemName = i.values[0]
				let playerItem = player.items.usable.find(i => i.name == itemName)
				let power = playerItem.power

				if (power.life && power.life >= 0 && player.life < player.totalLife || power.mana && power.mana >= 0 && player.mana < player.totalMana) {
					if (playerItem.amount <= 1) player.items.usable.splice(player.items.usable.indexOf(playerItem), 1)
					else player.items.usable[player.items.usable.indexOf(playerItem)].amount -= 1
				}
				
				if (player.life+power.life >= player.totalLife) player.life = player.totalLife
				else player.life += power.life
				if (player.mana+power.mana >= player.totalMana) player.mana = player.totalMana
				else player.mana += power.mana

				let list = ''
				let rowItensMenuOptions = []
				for (let i in player.items.usable) {
					let item = player.items.usable[i]

					if (item.type == 'regenerate') {
						rowItensMenuOptions.push({
							label: this.structure.type == 'pt-BR' ? item.name : item.name_EN,
							description: this.structure.type == 'pt-BR' ? item.description : item.description_EN || 'p-p',
							value: item.name
						})
						list += `\`${item.amount}\` - **${this.structure.type == 'pt-BR' ? item.name : item.name_EN}** - **${item.power.life > 0 ? `❤️: \`${item.power.life}\`` : ''}  ${item.power.mana > 0 ? `🔥: \`${item.power.mana}\`` : ''}**\n`
					}
				}

				let rowSelectMenuItensMenu = new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId('dungeon--selectItem')
							.setPlaceholder(this.structure.dungeon.itemSelection)
							.addOptions(rowItensMenuOptions),
					);
				let components = []
				if (rowItensMenuOptions[0]) components.push(rowSelectMenuItensMenu)
				components.push(rowButtonsItensMenu)

				this.editMsg('selectItem', { msg, embed, player, list, components })
			}

			userResult.RPGPlayer = player
			await userResult.save()
		})
    }

	async editMsg(type, { msg, embed, player, list, userRPG, components, content }) {
		if (!components) components = []

		let attachment = new MessageAttachment(await this.canvasImages.RPGPlayerStatus(player), `img.png`)

		if (type == 'battle') {
			content = content || this.structure.dungeon.embedDungeon

			embed
				.setTitle('')
				.setThumbnail(userRPG.monster.image || message.user.avatarURL({ dynamic: true, format: "png", size: 1024 }) || message.user.defaultAvatarURL)
				.setDescription(content
					.replace(/{{monsterName}}/g, userRPG.monster.name)
					.replace(/{{monsterHP}}/g, userRPG.monster.life)
					.replace(/{{monsterAttack}}/g, userRPG.monster.attack)
				)
			msg.edit({ embeds: [embed], files: [attachment], components }).catch(() => null)
		} else if (type == 'selectItem') {
			embed
				.setTitle('')
				.setThumbnail('https://cdn.discordapp.com/attachments/766010028314066965/907426437911412757/image2-1.gif')
				.setDescription(this.structure.dungeon.embedItensMenu
					.replace('{{list}}', list == '' ? this.structure.dungeon.embedItensMenuCleanInventory : list)
				)
				msg.edit({ embeds: [embed], files: [attachment], components }).catch(() => null)
		}
	}
}