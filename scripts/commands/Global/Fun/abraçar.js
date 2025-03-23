const request = require('node-superfetch');
const Functions = require('../../../structures/functions/index');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para abraçar',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['hug', 'abraço', 'abraco'];
        this.helpen = 'From a hug to a person';
        this.help = 'De um abraço em um pessoa';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985576725377327174/unknown.png'        
        this.howToUsePT = '<usuário/id de usuário>'
        this.howToUseEN = '<user/userID>'
    }

    async run(message) {
        let avatar = message.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }) || message.user.defaultAvatarURL
    
        let href = await this.search(this.config.GIFS_KEY)
        let rand = Math.floor(Math.random() * href.data.length);
        let image = href.data[rand].images.downsized_large.url

        let user = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null);
        user = user ? user.user : null;

        if (!user) return message.alphaReplyError(this.events.commands.noidofmetion);

        const attachment = new MessageAttachment(image, `${this.name[0]}.gif`);
    
        const embed = new MessageEmbed()
            .setAuthor({ name: message.guild.members.cache.get(message.user.id).nickname || message.user.username, iconURL: avatar })
            .setTitle(this.structure.hug.embed_title)
            .setColor(this.config.botColor1)
            .setDescription(`${message.user} ${this.structure.hug.embed_description} ${user}`)
            .setImage(`attachment://${this.name[0]}.gif`)
            .setThumbnail(avatar)
            .setTimestamp()
        return message.alphaReply({ embeds: [embed], files: [attachment] });
    }

    async search(key) {
        const { body } = await request.get(`https://api.giphy.com/v1/gifs/search?api_key=${key}`).query({
            q: "hug pat",
            limit: 50
        })


        if(!body) return null
        return body
    }
}