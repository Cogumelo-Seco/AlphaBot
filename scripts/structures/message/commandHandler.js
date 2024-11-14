const Functions = require('../functions');

module.exports = async (client, message, structure, events, config, guildResult, userResult) => {
    if (!message.content.replace(/[<@!>]/g, '').split(/ +/g).includes(client.user.id)) return

    let args = message.content.replace(/[<@!>]/g, '').replace(client.user.id, '').split(/ +/g)
    if (args[0] == '') args.splice(0, 1)

    const commandName = args.shift()?.toLowerCase();
    let getCommand = client.commands[commandName]?.class

    if (!commandName) return

    await require('./messageProps')(message, client, commandName);
    
    message.channel.sendTyping()

    if (!getCommand) {
        return message.alphaReply(events.commands.nocommand.replace('{{command}}', commandName))
            .then((msg) => setTimeout(() => msg.delete().catch(() => null), 5000))
    }

    if (!userResult) return message.alphaReplyError(events.dbs.noauthor)
    require('../configs/registerUser')(client, message.author, message.guild, config) 
    
    const verifiPermissions = await require('./filterMessagePermissions')(userResult, guildResult, message, getCommand, config, events, client)
    if (verifiPermissions !== true) return;

    const userData = client.usersDelay[message.author.id];
    if (!config.owners.includes(message.author.id) && userData) {
        if (+new Date() <= userData.date+userData.timer) {
            userData.timer = ((userData.date + userData.timer) - +new Date())+4000;
            userData.date = +new Date();
            let time = new Functions().formatTime(userData.date+userData.timer-+new Date(), null, client);
            if (time == '00s') time = `${userData.date+userData.timer-+new Date()}ms`;
            return message.alphaReplyError((events.src.timer).replace('{{time}}', time));
        } else if (+new Date() >= userData.date+userData.timer) delete client.usersDelay[message.author.id]
        else client.usersDelay[message.author.id] = userData;
    } else {
        client.usersDelay[message.author.id] ={
            timer: 5000,
            date: +new Date()
        };
    }

    userResult.commandsCounter += 1
    await userResult.save()

    if (getCommand) new getCommand({
        config,
        client,
        args,
        structure,
        events,
        message,
        slashCommand: false
    }).run(message)

    return require('./commandLog')(client, config, message, commandName);
};