const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

        this.permissionLevel = 1
        this.name = ['add']
        this.help = 'Comando para adicionar algo na db sem apagar ela';
    }

    async run(message) {
        const dbuser = this.client.schemas['user'];
        const dbserv = this.client.schemas['serv'];
        const dbrank = this.client.schemas['rank'];

        dbserv.find().then(async function(result){
            for (i = 0; i < result.length; i++){
    
                /*result[i].diamonds = result[i].diamonds || 13
                result[i].diamondsDelay = result[i].diamondsDelay || 0
                result[i].alphaCoins = result[i].alphaCoins || 13
                result[i].alphaCoinsDelay = result[i].alphaCoinsDelay || 0
                result[i].bank = result[i].bank || 13
                result[i].color = result[i].color || this.config.botColor1
                result[i].aboutme = result[i].aboutme || "Sou uma pessoa que gosta muito do Alpha ❤️ (Você pode trocar esta mensagem usando o comando aboutme)",
                result[i].ban = result[i].ban || false
                result[i].commandsCounter = result[i].commandsCounter || 0
                result[i].voteCounter = result[i].voteCounter || 0
                result[i].marryID = result[i].marryID || 'off'
                result[i].magicstones = result[i].magicstones || 0
                result[i].RPGPlayer = { xp: 0 } 

                if (result[i].color == '#8A2BE2') result[i].color = '#000000'
                if (result[i].color == '#8a2be2') result[i].color = '#000000'*/

                result[i].TWNotificationText = '§'
                result[i].YTNotificationText = '§'


                console.log(`Result: ${i} de ${result.length-1}`)
                result[i].save().catch((err) => console.error('ERRO: '+err))
            }
            return message.alphaReply(`**Alterações feita**`)
        }).catch((err) => console.error(err))
    }
}