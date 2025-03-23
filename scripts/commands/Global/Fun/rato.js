const request = require('node-superfetch');
const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.clientPermissionLevel = [26]
        this.name = ['rat', 'rato', 'ratinho', 'mouse'];
        this.helpen = 'Send the image of a mouse';
        this.help = 'Envia a imagem de um rato';
    }

    async run(message) {
        let avatar = message.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }) || message.user.defaultAvatarURL
    
        let href = await this.search(this.config.GIFS_KEY)
        let rand = Math.floor(Math.random() * href.data.length);
        let image = href.data[rand].images.downsized_large.url
    
        const embed = new MessageEmbed()
            .setAuthor({ name: message.guild.members.cache.get(message.user.id).nickname || message.user.username, iconURL: avatar })
            .setColor(this.config.botColor1)
            .setImage(image)
            .setTimestamp()
        return message.alphaReply({ embeds: [embed] });
    }

    async search(key) {
        const { body } = await request.get(`https://api.giphy.com/v1/gifs/search?api_key=${key}`).query({
            q: "mouse",
            limit: 50
        })


        if(!body) return null
        return body
    }
}