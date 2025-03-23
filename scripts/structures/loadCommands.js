const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const { join } = require('path');
const filePath = join(__dirname, "..", "commands");

module.exports = async (client) => {
    const AlphaConsole = client.functions.console

    try {
        let debug = false
        let testBot = client.user.id == '766006179209936946' ? false : true
        let current = 0
        let necessary = 0
        let failures = []

        async function loaded() {
            current++
            if (current >= necessary) {
                let failuresText = ''
                for (let i in failures) 
                    failuresText += `❌  ${failures[i].commandName} -- ${failures[i].err}\n`
                AlphaConsole.log(`${necessary} Comandos carregados!`)
                if (failures[0]) AlphaConsole.warn(`Falhas: \n${failuresText}`)

                let applicationCommands = testBot ? (await client.guilds.fetch('766021715192709153')).commands : client.application.commands
                let applicationCommandsList = await applicationCommands.fetch().catch(() => null)

                if (!debug) for (let command of Array.from(Object(applicationCommandsList).values())) {
                    let commandName = command.name
                    if (!client.slashCommands[commandName]) applicationCommands.delete(command.id)
                        .then(() => AlphaConsole.warn(`Comando ${commandName} deletado`))
                        .catch(AlphaConsole.error)
                }
            }
        }

        const applicationsSet = async (props, commandName, category) => {
            const commandSlashOptions = new props().slashOptions || [];
            client.slashCommands[commandName] = props
            client.slashCommands[commandName] = {
                class: props,
                commandName,
                commandNames: new props().name,
                category
            }
            necessary++

            if (!testBot)
                client.api.applications(client.user.id).commands.post({data: {
                    name: commandName,
                    description: new props().help || 'Sem descrição',
                    options: commandSlashOptions
                }}).then((command) => {
					//client.api.applications(client.user.id).commands(command.id).delete();
                    loaded()
                }).catch((err) => {
                    if(err.code != 30032) AlphaConsole.error(err)
                    AlphaConsole.error(`${commandName}`)
                    failures.push({ commandName, err: err.stack.split('\n')[0] })
                    loaded()
                })
            else 
                client.api.applications(client.user.id).guilds('766021715192709153').commands.post({data: {
                    name: commandName,
                    description: new props().help || 'Sem descrição',
                    options: commandSlashOptions
                }}).then((command) => {
                    loaded()
                    //client.api.applications(client.user.id).guilds('766021715192709153').commands(command.id).delete();
                }).catch((err) => {
                    if(err.code != 30032) AlphaConsole.error(err)
                    AlphaConsole.error(`${commandName}`)
                    failures.push({ commandName, err: err.stack.split('\n')[0] })
                    loaded()
                })
        }
        
        let dir = filePath
        let dirAdd = (file, dir) => {
            if (file && dir) dir += '/'+file
            fs.readdir(dir, (err, files) => {
                if (err) return;
                if (files) files.forEach((file) => {
                    if (!file.endsWith('.js')) return dirAdd(file, dir)
                    let directory = (`${dir}/${file}`).replace(/\\/g, '/')

                    try {
                        let commandName = file.replace('.js', '');
                        let type = directory.split('/')[directory.split('/').length-3]

                        if (commandName == 'op') console.log('p-p')
                        else {
                            let props = require(directory);
                            const names = new props().name
                            category = directory.split('/')[directory.split('/').length-2]

                            if (type == 'Global') {
                                for (i = 0; i < names.length; i++) 
                                    client.commands[names[i]] = {
                                        class: props,
                                        category,
                                        commandName,
                                        commandNames: names
                                    }
                                if (!debug || commandName == debug) applicationsSet(props, commandName, category)
                            } else if (type == 'Message') {
                                for (i = 0; i < names.length; i++) 
                                    client.commands[names[i]] = {
                                        class: props,
                                        category,
                                        commandName,
                                        commandNames: names
                                    }
                            }

                            return;
                        }
                    } catch (err) {
                        AlphaConsole.error(err)
                    }
                })
            })
        }
        dirAdd(null, dir)
    } catch (err) {
        AlphaConsole.error('[LOAD COMMANDS] ERRO: '+err)

        let channel = await client.fetchWebhook(config.WEBHOOK2.split('|')[0], config.WEBHOOK2.split('|')[1])
        const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack

        const msg = new MessageEmbed()
            .setColor(config.botColor2)
            .setTimestamp()
            .setDescription(`**ERRO:**\`\`\`js\n${errorMessage}\`\`\``)
        return channel.send({ embeds: [msg] }).catch(() => null)
    }
    return;
}
