const fs = require('fs');
const { join } = require('path');
const filePath = join(__dirname, "..", "commands", "Global");

const commands = (client) => {
	let text = '{'

	let dir = filePath
	let dirAdd = (file, dir) => {
		if (file && dir) dir += '/'+file
		fs.readdirSync(dir).forEach((file, i) => {
			if (!file.endsWith('.js')) return dirAdd(file, dir)
			const directory = (`${dir}/${file}`).replace(/\\/g, '/')
			const category = directory.split('/')[directory.split('/').length-2]
			const commandName = file.replace('.js', '');

			if (i == 0) text += `\n"${category}" : [`
			let total = fs.readdirSync(`${filePath}/${category}`).length-1;
			let help = require(`${filePath}/${category}/${file}`)
			if (i == total) text += `
			{ 
				"name": "${commandName}", 
				"pt": "${new help().help || 'Sem descrição'}", 
				"en": "${new help().helpen || 'Without description'}",
				"synonyms": "${new help().name}",
				"howToUsePT": ${new help().howToUsePT ? `"${new help().howToUsePT.replace(/["]/g, '\'')}"` : null},
				"howToUseEN": ${new help().howToUseEN ? `"${new help().howToUseEN.replace(/["]/g, '\'')}"` : null},
				"usageExample": ${new help().usageExample ? `"${new help().usageExample}"` : null}
			} ] , \n`
			else text += `
			{ 
				"name": "${commandName}", 
				"pt": "${new help().help || 'Sem descrição'}", 
				"en": "${new help().helpen || 'Without description'}",
				"synonyms": "${new help().name}",
				"howToUsePT": ${new help().howToUsePT ? `"${new help().howToUsePT.replace(/["]/g, '\'')}"` : null},
				"howToUseEN": ${new help().howToUseEN ? `"${new help().howToUseEN.replace(/["]/g, '\'')}"` : null},
				"usageExample": ${new help().usageExample ? `"${new help().usageExample}"` : null}
			},\n`
		})
	}
	dirAdd(null, dir)

	text = text.split(' ')
	text[text.length-2] = '}'
	text = text.join(' ')

	return JSON.parse(text);
}

module.exports = {
	commands
}