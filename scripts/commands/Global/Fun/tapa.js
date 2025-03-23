const request = require('node-superfetch');
const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para dar um tapa',
                required: true,
                type: 6
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['tapa', 'slap'];
        this.helpen = 'Slap people';
        this.help = 'De um tapa em um pessoa';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985580183039918182/unknown.png'
        this.howToUsePT = '<usuário/id de usuário>'
        this.howToUseEN = '<user/userID>'
    }

    async run(message) {
        let avatar = message.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }) || message.user.defaultAvatarURL

		let images = [
            'https://c.tenor.com/XilJkd9iUUYAAAAd/memes-dank-memes.gif',
			'https://c.tenor.com/cqnZ1RW_XjsAAAAC/horny-bonk.gif'
        ]
    
        let href = await this.search(this.config.GIFS_KEY)
        let rand = Math.floor(Math.random() * href.data.length);
        let image = href.data[rand].images.downsized_large.url

		let percent = Math.floor(Math.random() * 100)
        if (percent <= 20) image = images[Math.floor(Math.random() * (images.length-1))]

        let user = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).catch(() => null);
        user = user ? user.user : null;
        
        if (!user) return message.alphaReplyError(this.events.commands.noidofmetion);
    
        const embed = new MessageEmbed()
            .setAuthor({ name: message.guild.members.cache.get(message.user.id).nickname || message.user.username, iconURL: avatar })
            .setTitle(this.structure.slap.embed_title)
            .setColor(this.config.botColor1)
            .setDescription(`${message.user} ${this.structure.slap.embed_description} ${user}`)
            .setImage(image)
            .setThumbnail(avatar)
            .setTimestamp()
        return message.alphaReply(`${user}`, { embeds: [embed] });
    }

    async search(key) {
        const { body } = await request.get(`https://api.giphy.com/v1/gifs/search?api_key=${key}`).query({
            q: "slap",
            limit: 50
        })


        if(!body) return null
        return body
    }
}