const fs = require('fs');
const { inspect } = require('util');
const { MessageEmbed } = require('discord.js')
const Stopwatch = require('../../../structures/timer.js');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.permissionLevel = 1
        this.name = ['ev', 'eval'];
        this.help = 'EVAL'
    }

    async run(message) {
		if (!this.args[0]){
			const embed = new MessageEmbed()
				.setColor(this.config.botColor1)
				.setDescription(`**Adicione um argumento!**`)
			return message.alphaReply({ embeds: [embed] })
		}
		let timer = new Stopwatch()
		try{
			let toEval = this.args.join(" ");
			let evaluated = null

			try{
				evaluated = await eval(toEval);
			}catch{
				evaluated = await eval(`(async () => {\n${toEval}\n})();`);
			}
			let type = ``
			if (typeof(evaluated)) type = `**Tipo:**\`\`\`json\n${typeof(evaluated)}\`\`\``
			if (typeof evaluated !== 'string') {
				evaluated = inspect(evaluated, {
					depth: toEval.depth ? parseInt(toEval.depth) || 0 : 0,
					showHidden: Boolean(toEval.showHidden),
				});
			}

			let resp = ``
			
			if (evaluated && evaluated.length < 1800)
				resp = `**Resposta:**\`\`\`json\n${evaluated}\`\`\`\n`

			timer.stop()

			if (evaluated && evaluated.length > 1800) {
				if (!this.args.join(" ").toLowerCase().includes("//nomsg")){
					const embed = new MessageEmbed()
						.setColor(this.config.botColor1)
						.setTitle('EVAL')
						.setDescription(`**Argumento:**\n\`\`\`js\n${toEval}\`\`\`\n${resp}\n${type}`)
					return message.alphaReply({ embeds: [embed], files:[this.textFile(evaluated, `EVAL`)] }).then().catch((err) => {
						const embed = new MessageEmbed()
							.setColor(this.config.botColor2)
							.setFooter({ text: `⏱ ${timer}` })
							.setTitle(`ERRO ${err.code ? `(${err.code})` : ''}`)
							.setDescription(`\`\`\`json\n${err}\`\`\``)
						return message.alphaReply({ embeds: [embed], files:[this.textFile(evaluated, `EVAL`)] })
					})
				}
			} else {
				if (!this.args.join(" ").toLowerCase().includes("//nomsg")){
					const embed = new MessageEmbed()
						.setColor(this.config.botColor1)
						.setFooter({ text: `⏱ ${timer}` })
						.setTitle('EVAL')
						.setDescription(`**Argumento:**\n\`\`\`js\n${toEval}\`\`\`\n${resp}\n${type}`)
					return message.alphaReply({ embeds: [embed] }).then().catch((err) => {
						const embed = new MessageEmbed()
							.setColor(this.config.colorerr)
							.setTitle(`ERRO ${err.code ? `(${err.code})` : ''}`)
							.setDescription(`\`\`\`json\n${err}\`\`\``)
						return message.alphaReply({ embeds: [embed] })
					})
				}
			}
			return;
		} catch (err) {
			const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack

			const embed = new MessageEmbed()
				.setColor(this.config.botColor2)
				if (err.code) embed.setTitle(`ERRO (${err.code})`)
				else embed.setTitle('ERRO')
				embed.setDescription(`\`\`\`js\n${errorMessage}\`\`\``)
			return message.alphaReply({ embeds: [embed] })
		}
    }
}