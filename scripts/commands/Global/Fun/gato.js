const request = require('node-superfetch');
const Functions = require('../../../structures/functions/index');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['cat', 'gato', 'gatinho'];
        this.helpen = 'Send the image of a cat';
        this.help = 'Envia a imagem de um gato';
    }

    async run(message) {
        let avatar = message.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }) || message.user.defaultAvatarURL
    
        let images = [
            'https://cdn.discordapp.com/attachments/792642251519426590/903775899399389234/unknown.png'
        ]

        let href = await this.search()
        let image = href.link

        let percent = Math.floor(Math.random() * 100)
        if (percent <= 20) image = images[Math.floor(Math.random() * (images.length-1))]
    
        const attachment = new MessageAttachment(image, `${this.name[0]}.gif`);

        const embed = new MessageEmbed()
            .setAuthor({ name: message.guild.members.cache.get(message.user.id).nickname || message.user.username, iconURL: avatar })
            .setColor(this.config.botColor1)
            .setImage(`attachment://${this.name[0]}.gif`)
            .setTimestamp()
        return message.alphaReply({ embeds: [embed], files: [attachment] });
    }

    async search() {
        const { body } = await request.get(`https://some-random-api.ml/img/cat`)

        if(!body) return null
        return body
    }
}