const request = require('node-superfetch');
const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para consolar',
                required: true,
                type: 6
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['comfort', 'consolo'];
        this.helpen = 'Comfort a people';
        this.help = 'Console um pessoa';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985577489806000169/unknown.png'
        this.howToUsePT = '<usuário/id de usuário>'
        this.howToUseEN = '<user/userID>'
    }

    async run(message) {
        let href = await this.search(this.config.GIFS_KEY)
        let rand = Math.floor(Math.random() * href.data.length);
        let image = href.data[rand].images.downsized_large.url

        let user = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null);
        user = user ? user.user : null;

        if (!user) return message.alphaReplyError(this.events.commands.noidofmetion);

        let avatar = message.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }) || message.user.defaultAvatarURL

        const embed = new MessageEmbed()
            .setAuthor({ name: message.guild.members.cache.get(message.user.id).nickname || message.user.username, iconURL: avatar })
            .setTitle(this.structure.comfort.embed_title)
            .setColor(this.config.botColor1)
            .setDescription(`${message.user} ${this.structure.comfort.embed_description} ${user}`)
            .setImage(image)
            .setThumbnail(avatar)
            .setTimestamp()
        return message.alphaReply({ embeds: [embed] });
    }

    async search(key) {
        const { body } = await request.get(`https://api.giphy.com/v1/gifs/search?api_key=${key}`).query({
            q: "comfort",
            limit: 50
        })


        if(!body) return null
        return body
    }
}