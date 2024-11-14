const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.slashOptions =  [
            {
                name: 'número',
                description: 'Adicione um número de lados para o dado',
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['rolar', 'dice', 'dado', 'roll'];
        this.helpen = 'Roll a die';
        this.help = 'Role um dado';
        this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/984955409376903270/unknown.png'
        this.howToUsePT = '<número>'
        this.howToUseEN = '<number>'
    }

    async run(message) {
        if (this.args[0]) this.args[0] = this.args[0].replace(/[^dD0-9]/g, '').toLowerCase()
        let numberOfDies = this.args[0] && this.args[0].split('d')[1] ? Number(this.args[0].split('d')[0]) || 1 : 1
        let numberOfSides = this.args[0] ? Number(this.args[0].split('d')[1]) && Number(this.args[0].split('d')[1]) >= 2 && Number(this.args[0].split('d')[1]) <= 10000 ? Number(this.args[0].split('d')[1]) : Number(this.args[0].split('d')[0]) >= 2 && Number(this.args[0].split('d')[0]) <= 1000 ? Number(this.args[0].split('d')[0]) : 6 : 6
        let randomNumber = 0
        
        for (let i = 1;i <= numberOfDies;i++) randomNumber += Math.floor(Math.random()*numberOfSides)

        return message.alphaReply(this.structure.roll.txt.replace('{{numberOfDies}}', numberOfDies).replace('{{numberOfSides}}', numberOfSides).replace('{{randomNumber}}', randomNumber))
    }
}