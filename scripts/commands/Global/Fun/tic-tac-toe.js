const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para jogar',
                required: true,
                type: 6
            }
        ];
		this.clientPermissionLevel = [26, 22]
        this.name = ['hash', 'jogodavelha', 'hashgame', 'velha', 'tic-tac-toe'];
        this.helpen = 'Play the old game';
        this.help = 'Jogue o velho jogo da velha!!';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985580456898596894/unknown.png'
        this.howToUsePT = '<usuário/id de usuário>'
        this.howToUseEN = '<user/userID>'
    }

    async run(message) {
        let user = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null)
        user = user ? user.user : null;

        if (!user) return message.alphaReplyError(this.events.commands.noidofmetion)
        if(user.id == message.user.id) return message.alphaReplyError(this.structure.hash.sameUser)
        if (user.bot) return message.alphaReplyError(this.structure.hash.userBot)

        const rowButtons1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('hash--1-1')
                    .setEmoji('❔')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('hash--1-2')
                    .setEmoji('❔')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('hash--1-3')
                    .setEmoji('❔')
                    .setStyle('SECONDARY'),
			)
        const rowButtons2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('hash--2-1')
                    .setEmoji('❔')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('hash--2-2')
                    .setEmoji('❔')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('hash--2-3')
                    .setEmoji('❔')
                    .setStyle('SECONDARY'),
			)
        const rowButtons3 = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('hash--3-1')
                    .setEmoji('❔')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('hash--3-2')
                    .setEmoji('❔')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('hash--3-3')
                    .setEmoji('❔')
                    .setStyle('SECONDARY'),
			)

        let msg = await message.alphaReply({ content: this.structure.hash.description.replace('{{user}}', user).replace(/{{author}}/g, message.user), components: [rowButtons1, rowButtons2, rowButtons3] })
        if (!msg) return
        let author = true

        msg.createMessageComponentCollector({ filter: i => i.user.id == message.user.id || i.user.id == user.id, time: 60000 })
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

            let actionRow = Number(i.customId.split('--')[1].split('-')[0])
            let component = Number(i.customId.split('--')[1].split('-')[1])

            if (i.user.id == message.user.id && !author) return;
            if (i.user.id != message.user.id && author) return;

            let verticalLine = msg.components.map(c => c.components[component-1])
            let diagonalLine1 = []
            let diagonalLine2 = []
            for (let i in msg.components) diagonalLine1.push(msg.components[i].components[i])
            for (let i in msg.components) diagonalLine2.push(msg.components[i].components[Math.abs(i-3)-1])

            let edit = this.edit(msg, message, i.user.id == message.user.id, actionRow, component, user)
            if (edit) author = author ? false : true

            let componentsArray = msg.components.map(c => c.components)
            let verify = 0
            for (let i in componentsArray) {
                for (let a in componentsArray[i]) {
                    if (componentsArray[i][a].emoji.name == '❌' || componentsArray[i][a].emoji.name == '⭕') verify += 1
                }
            }

            if (i.user.id == message.user.id && msg.components[actionRow-1].components.filter(c => c.emoji.name == '❌').length >= 3) return this.gameWon(msg, message, true, user)
            if (i.user.id == message.user.id && verticalLine.filter(c => c.emoji.name == '❌').length >= 3) return this.gameWon(msg, message, true, user)
            if (i.user.id == message.user.id && diagonalLine1.filter(c => c.emoji.name == '❌').length >= 3) return this.gameWon(msg, message, true, user)
            if (i.user.id == message.user.id && diagonalLine2.filter(c => c.emoji.name == '❌').length >= 3) return this.gameWon(msg, message, true, user)
            if (i.user.id != message.user.id && msg.components[actionRow-1].components.filter(c => c.emoji.name == '⭕').length >= 3) return this.gameWon(msg, message, false, user)
            if (i.user.id != message.user.id && verticalLine.filter(c => c.emoji.name == '⭕').length >= 3) return this.gameWon(msg, message, false, user)
            if (i.user.id != message.user.id && diagonalLine1.filter(c => c.emoji.name == '⭕').length >= 3) return this.gameWon(msg, message, false, user)
            if (i.user.id != message.user.id && diagonalLine2.filter(c => c.emoji.name == '⭕').length >= 3) return this.gameWon(msg, message, false, user)

            if (verify >= 9) return this.gameWon(msg, message, null, user, true)
        })
    }

    edit(msg, message, author, actionRow, component, user) {
        if (msg.components[actionRow-1].components[component-1].emoji.name == '❌' || msg.components[actionRow-1].components[component-1].emoji.name == '⭕') {
            msg.edit({ content: this.structure.hash.alert.replace('{{user}}', author ? message.user : user) }).catch(() => null)
            return false
        }
        
        msg.components[actionRow-1].components[component-1].emoji.name = author ? '❌' : '⭕'

        let components = msg.components

        msg.edit({ content: this.structure.hash.turn.replace('{{user}}', author ? user : message.user), components }).catch(() => null)
        return true
    }

    gameWon(msg, message, author, user, nobodyWon) {
        const embed = new MessageEmbed()

        if(nobodyWon) {
            embed
                .setColor(this.config.botColor2)
                .setDescription(this.structure.hash.nobodyWon)
            msg.edit({ content: `${message.user} ${user}`, embeds: [embed], components: [] }).catch(() => null)
        } else {
            embed
                .setColor(this.config.botColor1)
                .setDescription(this.structure.hash.won.replace('{{user}}', author ? message.user : user))
            msg.edit({ content: `${author ? message.user : user}`, embeds: [embed], components: [] }).catch(() => null)
        }
    }
}