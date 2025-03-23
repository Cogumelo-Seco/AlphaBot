module.exports = (message, client, commandName, slashMessage) => {
    message.commandName = commandName
    message.user = message.author

    message.defer = async () => null

    message.alphaReply = async (content, options) => {
        const userCommandData = client.userCommand[message.author.id];

        let data = {
            content,
            embeds: [],
            attachments: [],
            components: []
        }
        for (let i in options) data[i] = options[i]

        if (typeof content == 'object') {
            data = {
                content: `${message.author}`,
                embeds: [],
                attachments: [],
                components: []
            }
            for (let i in content) data[i] = content[i]
        }

        if (userCommandData && userCommandData.commandName == commandName && message.editedTimestamp) 
            msg = (await userCommandData.message).edit(data).catch(() => msg = message.reply(data))
        else
            msg = await message.reply(data).catch((err) => console.log(err))

        client.userCommand[message.author.id] = { commandName, message: msg }
        if (msg) msg.commandName = commandName

        return msg
    }
    
    message.alphaReplyError = async (content, options) => {
        const userCommandData = client.userCommand[message.author.id];

        let data = {
            content: `<a:not:797347840312868864> **|** ${content}`,
            embeds: [],
            attachments: [],
            components: []
        }
        for (let i in options) data[i] = options[i]

        if (typeof content == 'object') {
            data = {
                content: `${message.author}`,
                embeds: [],
                attachments: [],
                components: []
            }
            for (let i in content) data[i] = content[i]
        }

        if (userCommandData && userCommandData.commandName == commandName && message.editedTimestamp) 
            msg = (await userCommandData.message).edit(data).catch(() => msg = message.reply(data))
        else
            msg = await message.reply(data).catch((err) => console.log(err))

        client.userCommand[message.author.id] = { commandName, message: msg }
        if (msg) msg.commandName = commandName

        return msg
    }
}