const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const si = require('systeminformation')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['botinfo', 'bi'];
        this.helpen = 'Send bot information';
        this.help = 'Envia informações do bot';
    }

    async run(message) {
        let developer = await this.client.users.fetch('741352048271818823')

        let ownersText = ''
        let ownersArray = this.config.owners.split(', ')
        for (let ownerID of ownersArray) {
            if (ownerID != '741352048271818823') ownersText += ' \"'+(await this.client.users.fetch(ownerID)).username+'\" '
        }

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setAuthor({ name: `${this.structure.botinfo.embed_author} ${this.client.user.username}`, iconURL: this.client.user.avatarURL({ dynamic: true, format: "png", size: 1024 }) })
            .addFields(
                { name: `<a:developer:789970679625809960> **Developer:**`, value: `\`\`\`${developer.tag}\`\`\``, inline: false },
                { name: `<a:designer:789970628828332094> **${this.structure.botinfo.embed_field1}**`, value: `\`\`\`${ownersText}\`\`\``, inline: false },
                { name: `**<:js:797135204648484915> ${this.structure.botinfo.platform}**`, value: `\`JavaScript\``, inline: true },
                { name: `**<a:engrenagem:805200447921061949> ${this.structure.botinfo.embed_field5}**`, value: `\`${Object.keys(this.client.slashCommands).length}\``, inline: true },
                { name: `**📅 ${this.structure.botinfo.embed_field4}**`, value: `<t:${Math.floor(new Date(this.client.user.createdAt)/1000)}> \`(${this.formatTime(+new Date() - this.client.user.createdAt)})\``, inline: false },
            )
            .setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: message.user.avatarURL({ dynamic: true, format: "png", size: 1024 })  || message.user.defaultAvatarURL })
            .setTimestamp()

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previous')
                    .setEmoji('1️⃣')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('next')
                    .setEmoji('2️⃣')
                    .setStyle('SECONDARY'),
            );

        let msg = await message.alphaReply({ embeds: [embed], components: [row] })
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

            if (i.customId == 'next') {
                const embedLoading = new MessageEmbed()
                    .setColor(this.config.botColor1)
                    .setAuthor({ name: `💻 ${this.structure.botinfo.embed_author2}` })
                    .setDescription(`# <a:carregando:781209834061692938> **${this.structure.botinfo.loading}...**`)
                    .setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: message.user.avatarURL({ dynamic: true, format: "png", size: 1024 })  || message.user.defaultAvatarURL })
                    .setTimestamp()
                msg.edit({ embeds: [embedLoading] }).catch(() => null)
                
                let CPUInfo = await si.cpu()
                let memInfo = await si.mem()
                let osInfo = await si.osInfo()
                let baseboardInfo  = await si.baseboard()
                let graphicCardInfoText = ''
                let graphicCardInfo = await si.graphics()
                for (let i in graphicCardInfo.controllers) {
                    if (graphicCardInfo.controllers[i].vram > 0) graphicCardInfoText += `\nGraphicCard: \`${graphicCardInfo.controllers[i].model}\` \`${(graphicCardInfo.controllers[i].vram/1000).toFixed(0)} Gb\``
                }
                
                const status = `**${this.structure.botinfo.memoryt} \`${(memInfo.total/1000000000).toFixed(2)} Gb\`\n${this.structure.botinfo.memoryu} \`${(memInfo.available/1000000000).toFixed(2)} Gb\`\nCPU: \`${CPUInfo.physicalCores}/${CPUInfo.cores}\` - \`${CPUInfo.brand}\` \`${CPUInfo.speedMax} GHz\`${graphicCardInfoText}\nMainboard: \`${baseboardInfo.manufacturer}\` - \`${baseboardInfo.model}\`\n${this.structure.botinfo.platform} \`${osInfo.distro} ${osInfo.arch}\`\n${this.structure.botinfo.host} \`${osInfo.hostname}\`**`

                const users = (await this.client.shard.fetchClientValues("guilds.cache")).reduce((a, b) => a.concat(b)).map(g => g.memberCount).reduce((a, b) => a+b)
                const channels = (await this.client.shard.fetchClientValues("channels.cache.size")).reduce((a, b) => b + a)
                const servers = (await this.client.shard.fetchClientValues("guilds.cache.size")).reduce((a, b) => b + a)

                const embed2 = new MessageEmbed()
                    .setColor(this.config.botColor1)
                    .setAuthor({ name: `💻 ${this.structure.botinfo.embed_author2}` })
                    .addFields(
                        { name: `**<a:PepoDanceLS:797141083917516831> | ${this.structure.botinfo.embed_field10} | <a:PepoDanceLS:797141083917516831>**`, value: `\`\`\`${servers}\`\`\``, inline: true },
                        { name: `**💬 | ${this.structure.botinfo.embed_field7} | 💬**`, value: `\`\`\`${channels}\`\`\``, inline: true },
                        { name: `**🤷‍♂️ | ${this.structure.botinfo.embed_field8} | 🤷‍♂️**`, value: `\`\`\`${users}\`\`\``, inline: true },
                        { name: `**⏱️ | ${this.structure.botinfo.embed_field9} | ⏱️**`, value: `\`\`\`${this.formatTime(this.client.uptime)}\`\`\``, inline: false },
                        { name: `** **`, value: `${status}`, inline: false },
                    )
                    .setFooter({ text: `${this.events.commands.footer} ${message.user.tag}`, iconURL: message.user.avatarURL({ dynamic: true, format: "png", size: 1024 })  || message.user.defaultAvatarURL })
                    .setTimestamp()
                msg.edit({ embeds: [embed2] }).catch(() => null)
            } else if (i.customId == 'previous') {
                msg.edit({ embeds: [embed] }).catch(() => null)
            }
        })
    }
}