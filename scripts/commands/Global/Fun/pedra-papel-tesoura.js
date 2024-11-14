const request = require('node-superfetch');
const Functions = require('../../../structures/functions/index');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'resposta',
                description: 'Adicione o tipo de resposta',
                type: 3,
                required: true,
                choices: [
                    {
                      name: '🗻 Pedra',
                      value: 'rock',
                    },
                    {
                      name: '📰 Papel',
                      value: 'paper',
                    },
                    {
                      name: '✂️ Tesoura',
                      value: 'scissors',
                    },
                ]
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = [ 'rockpaperscissors', 'pedrapapeltesoura', 'jokenpo', 'jankenpon', 'pedra-papel-tesoura', 'ppt', 'rps', 'rock-paper-scissors'];
        this.helpen = 'Play rock, paper, scissors with the bot';
        this.help = 'Jogue pedra, papel e tesoura com o bot';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/1202839961901203476/image.png'
    }

    async run(message) {
        let options = {
            pedra: 1,
            papel: 2,
            tesoura: 3,
            rock: 1,
            paper: 2, 
            scissors: 3
        }

        let rules = {
            1: 3,
            2: 1,
            3: 2
        }

        let userChoice = this.args[0]
        let botChoice = Math.floor(Math.random()*3)+1

        if (!options[userChoice]) return message.alphaReplyError({ content: `\`${userChoice}\` Não é um parâmetro correto.` })

        const result = await this.client.schemas['user'].findById(message.user.id);
        const embed = new MessageEmbed()
            .setColor(result.color || this.config.botColor1)

        if (options[userChoice] == botChoice) embed.setDescription(this.structure.rps.draw.replace('{{botChoice}}', this.structure.rps.options[botChoice-1]).replace('{{userChoice}}', this.structure.rps.options[options[userChoice]-1]))
        else if (rules[options[userChoice]] == botChoice) embed.setDescription(this.structure.rps.win.replace('{{botChoice}}', this.structure.rps.options[botChoice-1]).replace('{{userChoice}}', this.structure.rps.options[options[userChoice]-1]))
        else embed.setDescription(this.structure.rps.lost.replace('{{botChoice}}', this.structure.rps.options[botChoice-1]).replace('{{userChoice}}', this.structure.rps.options[options[userChoice]-1]))

        return message.alphaReply({ embeds: [embed] })
    }
}