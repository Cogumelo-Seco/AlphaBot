const Functions = require('../../../structures/functions/index');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'rank',
                description: 'Adicione o rank a ser mostrado',
                type: 3,
                required: true,
                choices: [
                    {
                      name: '💎 | Diamantes',
                      value: 'diamantes',
                    },
                    {
                        name: '⚔️ | RPG',
                        value: 'rpg',
                    },
                    {
                        name: '💞 | Votos',
                        value: 'votos',
                    },
                    {
                        name: '💻 | Comandos',
                        value: 'comandos',
                    },
                    {
                        name: '🔮 | Pedramagica',
                        value: 'pedramagica',
                    },
                    {
                        name: '📈 | Rank',
                        value: 'rank',
                    }
                ]
            },
            {
                name: 'página',
                description: 'Escolha a pagina que quer vizualizar',
                type: 3,
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['top']
        this.helpen = 'Displays Alpha Ranks';
        this.help = 'Exibe os top ranks do Alpha';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985583556988387508/unknown.png'
        this.howToUsePT = '<rank> [número da categoria]'
        this.howToUseEN = '<rank> [category number]'
    }

    async run(message) {
        if (Number(this.args[1]) < 0 || Number(this.args[1]) > 200) return message.alphaReplyError(this.structure.top.embed_description)

        message.defer().then(async () => {
            var option = this.args[0] ? this.args[0].toLowerCase() : null
            let page = Number(this.args[1]) || 1

            let { text, type, result } = await this.buildMessage(page, option, message)

            if (!text) {
                page = 1
                let props = await this.buildMessage(page, option, message)
                text = props.text
                type = props.type
                result = props.result
                if (!text) return
            }

            let user = await this.client.users.fetch(result[0].userID || result[0]._id).catch(() => null);

            let avatar = user ? user.avatarURL({ dynamic: true, format: "png" }) || user.defaultAvatarURL : this.randomAvatar()

            const embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setTitle(`${this.structure.top[type].title} ${page}º`)
                .setDescription(`${text}`)
                .setThumbnail(avatar)

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('previous')
                        .setEmoji('◀️')
                        .setDisabled(page > 1 ? false : true)
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('next')
                        .setEmoji('▶️')
                        .setDisabled(page < 200 && 6 <= result.length/page ? false : true)
                        .setStyle('SECONDARY'),
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
                await i.deferUpdate();

                if (i.customId == 'next') {
                    page += 1
                    let { text, type, result } = await this.buildMessage(page, option, message)
                    embed
                        .setTitle(`${this.structure.top[type].title} ${page}º`)
                        .setDescription(`${text}`)

                    let components = msg.components

                    if (page > 1) components[0].components[0].setDisabled(false)
                    else components[0].components[0].setDisabled(true)
                    if (page < 200 && 5 <= result.length/page) components[0].components[1].setDisabled(false)
                    else components[0].components[1].setDisabled(true)

                    msg.edit({ embeds: [embed], components }).catch(() => null)
                } else {
                    page -= 1
                    let { text, type, result } = await this.buildMessage(page, option, message)
                    embed
                        .setTitle(`${this.structure.top[type].title} ${page}º`)
                        .setDescription(`${text}`)

                    let components = msg.components

                    if (page > 1) components[0].components[0].setDisabled(false)
                    else components[0].components[0].setDisabled(true)
                    if (page < 200 && 5 <= result.length/page) components[0].components[1].setDisabled(false)
                    else components[0].components[1].setDisabled(true)

                    msg.edit({ embeds: [embed], components }).catch(() => null)
                }
            })
        })
    }

    async buildMessage(page, option, message) {
        var result = null
        var type = null

        if (option == 'diamonds' || option == 'diamantes') {
            result = await this.client.schemas['user'].find().sort([['bank', 'descending']]).limit(5*page+1)
            type = 'diamonds'
        } else if (option == 'votes' || option == 'votos') {
            result = await this.client.schemas['user'].find().sort([['voteCounter', 'descending']]).limit(5*page+1)
            type = 'votes'
        } else if (option == 'commands' || option == 'comandos') {
            result = await this.client.schemas['user'].find().sort([['commandsCounter', 'descending']]).limit(5*page+1)
            type = 'commands'
        } else if (option == 'magicstone' || option == 'pedramagica') {
            result = await this.client.schemas['user'].find().sort([['magicstones', 'descending']]).limit(5*page+1)
            type = 'magicstone'
        } else if (option == 'rpg') {
            result = await this.client.schemas['user'].find().sort([['RPGPlayer.totalXP', 'descending']]).limit(5*page+1)
            type = 'rpg'
        } else if (option == 'rank') {
            result = await this.client.schemas['rank'].find({ guildID: `${message.guild.id}` }).sort([['totalXP', 'descending']]).limit(5*page+1)
            type = 'rank'
        }

        if (!type) {
            const embed = new MessageEmbed()
                .setColor(this.config.botColor2)
                .setDescription(this.structure.top.embed3_description)
            return message.alphaReply({ embeds: [embed] })
        }

        let cont = page

        let text = ''
        for (i = 5*cont-5; i < 5*cont; i++){
            if (!result[i]) i = 5*cont
            else {
                let user = await this.client.users.fetch(result[i].userID || result[i]._id);

                if (type == 'rank') text += `**${i+1}º - ${user.username || result[i].userID}** \n${this.structure.top[type].description}: \`${result[i].level}\`\nXP: \`${result[i].xp}\`\n\n`
                if (type == 'diamonds') text += `**${i+1}º - ${user.username || result[i]._id}** \n${this.structure.top[type].description} \`${result[i].bank}\`\n\n`
                if (type == 'magicstone') text += `**${i+1}º - ${user.username || result[i]._id}** \n${this.structure.top[type].description} \`${result[i].magicstones}\`\n\n`
                if (type == 'votes') text += `**${i+1}º - ${user.username || result[i]._id}** \n${this.structure.top[type].description} \`${result[i].voteCounter}\`\n\n`
                if (type == 'commands') text += `**${i+1}º - ${user.username || result[i]._id}** \n${this.structure.top[type].description} \`${result[i].commandsCounter}\`\n\n`
                if (type == 'rpg') text += `**${i+1}º - ${user.username || result[i]._id}** \n${this.structure.top[type].description} \`${result[i].RPGPlayer.level || 0}\`\n${this.structure.top[type].description2} \`${result[i].RPGPlayer.xp || 0}\`\n\n`
            }
        }

        return { text, type, result }
    }
}