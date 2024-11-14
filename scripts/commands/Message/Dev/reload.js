const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { join } = require('path');
const filePath = join(__dirname, "..", "..", "..");
const Stopwatch = require('../../../structures/timer');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        for (let i in props) {
            this[i] = props[i]
        }

        this.permissionLevel = 1
        this.name = ['r', 'rl', 'reload']
        this.help = 'Recarrega os comandos do bot'
    }

    async run(message) {
        let embed = new MessageEmbed()
            .setColor(this.config.botColor1)
            .setDescription('**Recarregando...**')
        let msg = await message.alphaReply({ embeds: [embed] });

        let fileCounter = 0
        let timer = new Stopwatch()

        let dir = filePath
        let dirAdd = (file, dir) => {
            if (file && dir) dir += '/'+file
            fs.readdirSync(dir).forEach((file, i) => {
                if (!file.split('.')[1]) return dirAdd(file, dir)
                else if (file.endsWith('.js')) {
                    const directory = (`${dir}/${file}`).replace(/\\/g, '/')
                    fileCounter++

                    try {
                        delete require.cache[ require.resolve(directory) ];
                        const props = require(directory);
                        try {
                            const type = directory.split('/')[directory.split('/').length-3]
                            const commandName = file.replace('.js', '');

                            if (type == 'Message') {
                                let names = new props().name

                                for (let i = 0; i < names.length; i++){
                                    delete this.client.commands[names[i]].class;
                                    this.client.commands[names[i]].class = props;
                                }
                            } else if (type == 'Global' && this.client.slashCommands[commandName]) {
                                let names = new props().name
                                
                                for (let i = 0; i < names.length; i++){
                                    if (this.client.commands[names[i]]) delete this.client.commands[names[i]].class;
                                    this.client.commands[names[i]].class = props;
                                }
                                if (this.client.slashCommands[commandName]) delete this.client.slashCommands[commandName].class;
                                this.client.slashCommands[commandName].class = props;
                            }
                            
                            return;
                        } catch (err) {                                
                            if (!err.stack.startsWith('TypeError: props is not a constructor')) {
                                const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack

                                let embed = new MessageEmbed()
                                    .setColor(this.config.botColor2)
                                    .setTitle('ERROR')
                                    .setDescription(`\`\`\`json\n${errorMessage}\`\`\``)
                                    .setFooter({ text: `` })
                                msg.edit({ embeds: [embed] })
                                this.console.error(err)
                            }
                        }
                    } catch (err) {
                        return this.console.error(err)
                    }
                }
            })
        }
        dirAdd(null, dir)

        embed
            .setColor(this.config.botColor1)
            .setDescription(`**Carregado \`${fileCounter}\` arquivos!**`)
            .setFooter({ text: `⏱ ${timer}` })
        msg.edit({ embeds: [embed] }).catch(() => null)
    }
}