const Functions = require('../../../structures/functions/index');
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'jogo',
                description: 'Adicione o nome de um jogo para ver informações',
                required: true,
                type: 3
            }
        ];
        this.clientPermissionLevel = [26]
        this.name = ['rbgame', 'robloxgame'];
        this.help = 'Mostra informações de um jogo roblox';
        this.helpen = 'Show info for a roblox game';
        this.howToUsePT = '<nome de um jogo roblox>'
        this.howToUseEN = '<name of a roblox game>'
    }

    async run(message) {
        message.defer().then(async() => {
            let game = await this.getRbGame(this.args.join(' '))
            if (!game) return message.alphaReplyError(this.structure.rbgame.gameNotFound)
            let author = await this.getRbUser(game.creator.id)

            const embed = new MessageEmbed()
                .setColor(this.config.botColor1)
                .setTitle(game.name)
                .setURL(`https://www.roblox.com/games/${game.rootPlaceId}`)
            if (game.description) embed.setDescription(`**${this.structure.rbgame.description}:**\n\`\`\`${game.description.length > 250 ? `${game.description.slice(0, 250)}...` : game.description}\`\`\``)
			embed
                .addField(`**📌 ID:**`, `\`${game.rootPlaceId}\`/\`${game.id}\``, true)
                .addField(`**🎮 ${this.structure.rbgame.playing}:**`, `\`${game.playing}\``, true)
                .addField(`**⛔ ${this.structure.rbgame.maximumPlayers}:**`, `\`${game.maxPlayers}\``, true)
                .addField(`**👍 ${this.structure.rbgame.likedIt}:**`, `\`${(game.totalUpVotes/(game.totalUpVotes+game.totalDownVotes)*100).toFixed(0)}%\` \`${game.totalUpVotes}\``, true)
                .addField(`**👎 ${this.structure.rbgame.didNotLike}:**`, `\`${game.totalDownVotes}\``, true)
                .addField(`**👀 ${this.structure.rbgame.visits}:**`, `\`${this.numberConverter(game.visits)}\``, true)
                .addField(`**🤩 ${this.structure.rbgame.favorites}:**`, `\`${game.favoritedCount}\``, true)
                .addField(`**🎲 ${this.structure.rbgame.genre}:**`, `\`${game.genre}\``, true)
                .addField(`**💵 ${this.structure.rbgame.price}:**`, `\`${game.price || 0} Robux\``, true)
                //.addField(`**🎙️ ${this.structure.rbgame.voiceChat}:**`, `\`${game.VoiceEnabled ? this.structure.rbgame.yes : this.structure.rbgame.not}\``, true)
                .addField(`**📅 ${this.structure.rbgame.createdIn}:**`, `<t:${Math.floor(new Date(game.created)/1000)}> \`(${this.formatTime(+new Date() - game.created)})\``, false)
                .addField(`**📅 ${this.structure.rbgame.updated}:**`, `<t:${Math.floor(new Date(game.updated)/1000)}> \`(${this.formatTime(+new Date() - game.updated)})\``, false)

            if (author) embed.setAuthor({ name: `@${author.username}`, iconURL: author.thumbnail_circHeadshot[0].imageUrl })
            else embed.setAuthor({ name: game.creator.name })

            return message.alphaReply({ embeds: [embed] })
        })
    }
}