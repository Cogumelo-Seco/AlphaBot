const request = require('node-superfetch');
const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione o usuário que o fez rir',
                type: 6
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['laughing', 'rir', 'rindo']
        this.helpen = 'Show that you are laughing';
        this.help = 'Mostre que está rindo';

        this.howToUsePT = '[usuário/id de usuário]'
        this.howToUseEN = '[user/userID]'
    }

    async run(message) {
        let avatar = message.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }) || message.user.defaultAvatarURL
    
        let href = await this.search(this.config.GIFS_KEY)
        let rand = Math.floor(Math.random() * href.data.length);
        let image = href.data[rand].images.downsized_large.url

        let user = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null);
        user = user ? user.user : null;
    
        const embed = new MessageEmbed()
            .setAuthor(message.guild.members.cache.get(message.user.id).nickname || message.user.username, avatar)
            .setTitle(this.structure.laugh.embed_title)
            .setColor(this.config.botColor1)
            .setImage(image)
            .setThumbnail(avatar)
            .setTimestamp()

        if (user) {
            embed
                .setDescription((this.structure.laugh.embed_description).replace('{{author}}', message.user).replace('{{user}}', user))
            return message.alphaReply(`${user} ${message.user}`, { embeds: [embed] });
        } else {
            embed
                .setDescription((this.structure.laugh.embed_description2).replace('{{author}}', message.user))
            return message.alphaReply({ embeds: [embed] });
        }
    }

    async search(key) {
        const { body } = await request.get(`https://api.giphy.com/v1/gifs/search?api_key=${key}`).query({
            q: "laugh",
            limit: 50
        })

        if(!body) return null
        return body
    }
}