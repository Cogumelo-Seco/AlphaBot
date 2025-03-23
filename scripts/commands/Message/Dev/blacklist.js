const { MessageEmbed } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.permissionLevel = 1
        this.name = ['blacklist'];
        this.help = 'Bane alguém de usar o Alpha';
    }

    async run(message) {
        if (!this.args[0]){
            const embed = new MessageEmbed()
                .setColor(this.config.colorerr)
                .setDescription(`**Adicione o ID**`)
            return message.alphaReply({ embeds: [embed] })
        }

        var reason = this.args.slice(1).join(' '); 

        let user = message.mentions.users.first() || await this.client.users.fetch(this.args[0]).catch();
        let userID = user ? user.id : this.args[0]
        let tag = user ? user.tag : this.args[0]

        const channel = await this.client.fetchWebhook(this.config.WEBHOOK5.split('|')[0], this.config.WEBHOOK5.split('|')[1])

        let result = await this.client.schemas['user'].findById(userID)
        if (!result){
            const embed = new MessageEmbed()
                .setColor(this.config.colorerr)
                .setDescription(`**Não encontrei nenhum usuário com o ID \`${this.args[0]}\`**`)
            return message.alphaReply({ embeds: [embed] })
        }
        if (!result.ban){
            if (!reason) return message.alphaReplyNot('**Adicione uma razão!!**')

            const embed = new MessageEmbed()
                .setColor(this.config.color)
                .setDescription(`**Usuário \`${tag}\` foi adicionado a blacklist**`)
            message.alphaReply({ embeds: [embed] })
            result.ban = true

            const msg = new MessageEmbed()
                .setTimestamp()
                .setColor(this.config.color)
                .setThumbnail(user.avatarURL({ dynamic: true, format: "png", size: 2048 }) || this.randomAvatar())
                .setDescription(`**Usuário banido do ${this.client.user.username}\nMotivo: \`\`\`${reason}\`\`\`**`)
            channel.send(msg).then().catch(() => null)
        }else{
            const embed = new MessageEmbed()
                .setColor(this.config.color)
                .setDescription(`**Usuário \`${tag}\` foi retirado da blacklist**`)
            message.alphaReply({ embeds: [embed] })
            result.ban = false

            const msg = new MessageEmbed()
                .setTimestamp()
                .setColor(this.config.color)
                .setThumbnail(user.avatarURL({ dynamic: true, format: "png", size: 2048 }) || this.randomAvatar())
                .setDescription(`**Usuário desbanido do ${this.client.user.username}**`)
            channel.send(msg).then().catch(() => null)
        }
        return result.save()
    }
}