const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'emoji',
                description: 'Adicione um emoji, nome de emoji ou id de emoji',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26, 22, 9]
        this.name = ['emoji'];
        this.helpen = 'Send an emoji as an image';
        this.help = 'Envia um emoji em forma de imagem';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985582475608723546/unknown.png'
        this.howToUsePT = '<emoji/id de emoji/nome de emoji>'
        this.howToUseEN = '<emoji/emoji id/emoji name>'
    }

    async run(message) {
        if (!this.args[0]) return message.alphaReplyNot(sthis.tructure.emojiinfo.embed_description)

        var arg = this.args[0]
        var ver = this.args[0].split(':')
        if (ver[0] == '<') var arg = this.args[0].split(':')[1]
        if (ver[0] == '<a') var arg = this.args[0].split(':')[1]

        var emoji = message.guild.emojis.cache.find(emoji => emoji.name === arg) || message.guild.emojis.cache.find(emoji => emoji.id === arg)

        if (!emoji) return message.alphaReplyError(`**${this.structure.emoji.noFind} \`${arg}\`**`)

        var emojiurl = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}?size=2048`

        return message.alphaReply(emojiurl)
    }
}