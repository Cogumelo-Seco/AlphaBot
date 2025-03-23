const request = require('node-superfetch');
const Functions = require('../../../structures/functions/index');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['penguin', 'pingu', 'pinguim', 'pinguin'];
        this.helpen = 'Send the image of a penguin';
        this.help = 'Envia a imagem de um pinguim';
    }

    async run(message) {
        let avatar = message.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }) || message.user.defaultAvatarURL
    
        let href = await this.search(this.config.GIFS_KEY)
        let rand = Math.floor(Math.random() * href.data.length);
        let image = href.data[rand].images.downsized_large.url
    
        const attachment = new MessageAttachment(image, `${this.name[0]}.gif`);

        const embed = new MessageEmbed()
            .setAuthor({ name: message.guild.members.cache.get(message.user.id).nickname || message.user.username, iconURL: avatar })
            .setColor(this.config.botColor1)
            .setImage(`attachment://${this.name[0]}.gif`)
            .setTimestamp()
        return message.alphaReply({ embeds: [embed], files: [attachment] });
    }

    async search(key) {
        const { body } = await request.get(`https://api.giphy.com/v1/gifs/search?api_key=${key}`).query({
            q: "penguin",
            limit: 50
        })


        if(!body) return null
        return body
    }
}