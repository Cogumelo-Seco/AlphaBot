const request = require('node-superfetch');
const Functions = require('../../../structures/functions/index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'arg',
                description: 'Adicione um argumento para ser procurado',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['search', 'search', 'procurar', 'find'];
        this.helpen = 'Look for a GIF on giphy';
        this.help = 'Procure um GIF no giphy';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985578415128182784/unknown.png'
        this.howToUsePT = '<o que procurar>'
        this.howToUseEN = '<what to look for>'
    }

    async run(message) {
        let msgSearch = this.args.join(' ');

        let href = await this.search(this.config.GIFS_KEY, msgSearch)
        
        if (!href.data[0]) return message.alphaReplyError((this.structure.searchGif.nofind).replace('{{args}}', msgSearch))
        
        let rand = Math.floor(Math.random() * href.data.length);
        let image = href.data[rand].images.downsized_large.url

        const embed = new MessageEmbed()
            .setDescription(`**[${href.data[rand].title}](<${href.data[rand].url}>)**`)
            .setColor(this.config.botColor1)
            .setImage(image)
            .setFooter({ text: href.data[rand].import_datetime })
            .setTimestamp()
        return message.alphaReply({ embeds: [embed] });
    }

    async search(key, msgSearch) {
        const { body } = await request.get(`https://api.giphy.com/v1/gifs/search?api_key=${key}`).query({
            q: msgSearch,
            limit: 50
        })


        if(!body) return null
        return body
    }
}