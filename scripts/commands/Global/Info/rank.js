const { MessageAttachment } = require('discord.js')
const Functions = require('../../../structures/functions');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'usuário',
                description: 'Adicione um usuário para ver o rank',
                type: 6
            }
        ];
		this.clientPermissionLevel = [9]
        this.name = ['rank', 'xp'];
        this.helpen = 'Displays your or someone\'s rank';
        this.help = 'Exibe o seu rank ou o de alguém';
    }

    async run(message) {
        message.defer().then(async () => {
            let user = await message.guild.members.fetch(this.args[0] ? this.args[0].replace(/[<@!>]/g, '') : null).then((m) => m.user).catch(() => null) || message.user

            const resultServ = await this.client.schemas['rank'].find({ guildID: `${message.guild.id}` }).sort([['totalXP', 'descending']])
            const userResult = await this.client.schemas['user'].findById(user.id);

            let result = await this.client.schemas['rank'].findOne({
                guildID: `${message.guild.id}`,
                userID: `${user.id}`
            })
              
            let rank = NaN;
            for (i = 0; i < resultServ.length; i++) {
                if (resultServ[i].userID == user.id) {
                    i == resultServ.length
                    rank = i+1
                    break
                }
            }

            let color = userResult ? userResult.color : null;
            
            const attatchment = new MessageAttachment(await this.canvasImages.rankCard(this.config, this.client, user, result, rank, color), `${user.tag}-${message.guild.name}-Rank.png`)
            return message.alphaReply({ files: [attatchment] })
        })
    }
}