const { MessageEmbed, MessageAttachment } = require('discord.js')
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário1',
                description: 'Adicione um usuário para shipar',
                type: 6
            },
            {
                name: 'usuário2',
                description: 'Adicione um usuário para shipar',
                type: 6
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['ship', 'shippar'];
        this.helpen = 'See if a couple would do well or not!';
        this.help = 'Veja se um casal daria certo ou não!';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985579968622887003/unknown.png'
        this.howToUsePT = '<usuário/id de usuário/mensagem> [usuário/id de usuário/mensagem]'
        this.howToUseEN = '<user/userID/message> [usuário/id de usuário/mensagem]'
    }

    async run(message) {
        let name1 = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).then((u) => u.username).catch(() => null) || this.args[0] || message.user.username;
        let name2 = await this.client.users.fetch(this.args[1] ? this.args[1].replace(/[<@!>]/g, '') : null).then((u) => u.username).catch(() => null) || this.args[1] || message.user.username;

        if (name1 == message.user.username) var avatar1 = message.user.avatarURL({ format: "png", size: 2048 })
        else var avatar1 = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).then((u) => u.avatarURL({ format: "png", size: 2048 })).catch(() => null) || this.randomAvatar()
        if (name2 == message.user.username) var avatar2 = message.user.avatarURL({ format: "png", size: 2048 })
        else var avatar2 = await this.client.users.fetch(this.args[0] ? this.args[1].replace(/[<@!>]/g, '') : null).then((u) => u.avatarURL({ format: "png", size: 2048 })).catch(() => null) || this.randomAvatar()

        let ship = name1.substring(0, name1.length/2) + name2.slice(name2.length/2)
        
        let buf1 = Buffer.from(name1, 'base64')
        let buf2 = Buffer.from(name2, 'base64')

        let percent = buf1.length/buf2.length || 0
        if (percent > 1) percent = buf2.length/buf1.length || 0

        let id1 = await this.client.users.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).then((u) => u.id).catch(() => null) || this.args[0] || message.user.id;
        let id2 = await this.client.users.fetch(this.args[1] ? this.args[1].replace(/[<@!>]/g, '') : null).then((u) => u.id).catch(() => null) || this.args[1] || message.user.id;
        const result = await this.client.schemas['user'].findById(id1)
        if (result && result.marryID == id2) percent = 1

        if (percent*100 >= 50 && percent*100 != 100) {
            var emoji = '❤️'
            var background = 2
            var text = (this.structure.ship.text1).replace('{{user1}}', `\`${name1}\``).replace('{{user2}}', `\`${name2}\``)
        } else if (percent*100 < 50 && percent*100 > 10) {
            var emoji = '💔'
            var background = 3
            var text = (this.structure.ship.text2).replace('{{user1}}', `\`${name1}\``).replace('{{user2}}', `\`${name2}\``)
        } else if (percent*100 <= 10) {
            var emoji = '🤺'
            var background = 4
            var text = (this.structure.ship.text3).replace('{{user1}}', `\`${name1}\``).replace('{{user2}}', `\`${name2}\``)
        } else {
            var emoji = '💘'
            var background = 1
            var text = (this.structure.ship.text4).replace('{{user1}}', `\`${name1}\``).replace('{{user2}}', `\`${name2}\``)
        }

        let attachment = new MessageAttachment(await this.canvasImages.shipImage(avatar1, avatar2, name1, name2, percent, background), `ship.png`);

        const embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription(`${emoji} **\`${name1}\` + \`${name2}\` = \`${ship}\`**\n\n${text}`)
            .setImage(`attachment://ship.png`)
        return message.alphaReply({ embeds: [embed], files: [attachment] })
    }
}
