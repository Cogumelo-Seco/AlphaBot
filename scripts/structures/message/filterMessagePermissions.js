const permissions = require('../configs/permissions');

module.exports = async (userResult, guildResult, message, getCommand, config, events, client) => {
    //if (!config.owners.includes(message.author.id) && guildResult.channels.includes(message.channel.id) && !message.member.permissions.has("MANAGE_CHANNELS")) return message.alphaReplyError(events.commands.blockchannel)

    let withoutPermission = ''
    let clientMember = await message.guild.members.fetch(client.user.id)
    if (!message.channel.permissionsFor(clientMember).has('SEND_MESSAGES')) return message.author.send(events.src.nosend).then().catch(() => null)
    let clientPermissionLevel = new getCommand().clientPermissionLevel
    if (clientPermissionLevel) clientPermissionLevel.push(28)
    else clientPermissionLevel = [28]
    for (let i of clientPermissionLevel) {
        if (guildResult.region == 'pt' && !message.channel.permissionsFor(clientMember).has(permissions[String(i)].name)) {
            withoutPermission += `${permissions[String(i)].name_PT}, `
        } else if (!message.channel.permissionsFor(clientMember).has(permissions[String(i)].name)) {
            withoutPermission += `${permissions[String(i)].name.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}, `
        }
    }
    if (withoutPermission) {
        return message.alphaReplyError(`**${events.src.botpermission} \`${withoutPermission}\`**`);
    }

    if (new getCommand().permissionLevel == 1 && !config.owners.includes(message.author.id)) {
        return message.alphaReplyError(events.commands.nopermission)
    }

    let userWithoutPermission = false
    if (new getCommand().permissionLevel && new getCommand().permissionLevel != 1 && guildResult.region == 'pt' && !message.member.permissions.has(permissions[String(new getCommand().permissionLevel)] ? permissions[String(new getCommand().permissionLevel)].name : null)) {
        userWithoutPermission = `${permissions[String(new getCommand().permissionLevel)].name_PT} `
    } else if (new getCommand().permissionLevel && new getCommand().permissionLevel != 1 && !message.member.permissions.has(permissions[String(new getCommand().permissionLevel)] ? permissions[String(new getCommand().permissionLevel)].name : null)) {
        userWithoutPermission = `${permissions[String(new getCommand().permissionLevel)].name.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())} `
    }
    if (userWithoutPermission) return message.alphaReplyError(`**${events.src.userpermission} \`${userWithoutPermission}\`**`);
    
    if (!config.owners.includes(message.author.id) && userResult.ban) return message.alphaReplyError((events.src.userbanned).replace('{{client}}', client.user.username))

    return true;
}