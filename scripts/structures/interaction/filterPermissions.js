const permissions = require('../configs/permissions');

module.exports = async (userResult, guildResult, interaction, getCommand, config, events, client) => {
    //if (!config.owners.includes(interaction.user.id) && guildResult.channels.includes(interaction.channel.id) && !interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.editReply(`**<a:not:797347840312868864> **|** ${events.commands.blockchannel}`)

    let withoutPermission = ''
    let clientMember = await interaction.guild.members.fetch(client.user.id)
    let clientPermissionLevel = new getCommand().clientPermissionLevel

    if (clientPermissionLevel) clientPermissionLevel.push(28)
    else clientPermissionLevel = [28]

    for (let i of clientPermissionLevel) {
        if (guildResult.region == 'pt' && !interaction.channel.permissionsFor(clientMember).has(permissions[String(i)].name))
            withoutPermission += `${permissions[String(i)].name_PT} `
        else if (!interaction.channel.permissionsFor(clientMember).has(permissions[String(i)].name))
            withoutPermission += `${permissions[String(i)].name.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())} `
    }

    if (withoutPermission) 
        return interaction.editReply(`**<a:not:797347840312868864> **| ${events.src.botpermission} \`${withoutPermission}\`**`);

    if (new getCommand().permissionLevel == 1 && !config.owners.includes(interaction.user.id))
        return interaction.alphaReplyError(`**${events.commands.nopermission}**`)

    let userWithoutPermission = false

    if (new getCommand().permissionLevel && new getCommand().permissionLevel != 1 && guildResult.region == 'pt' && !interaction.member.permissions.has(permissions[String(new getCommand().permissionLevel)] ? permissions[String(new getCommand().permissionLevel)].name : null))
        userWithoutPermission = `${permissions[String(new getCommand().permissionLevel)].name_PT} `
    else if (new getCommand().permissionLevel && !interaction.member.permissions.has(permissions[String(new getCommand().permissionLevel)] ? permissions[String(new getCommand().permissionLevel)].name : null))
        userWithoutPermission = `${permissions[String(new getCommand().permissionLevel)].name.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())} `

    if (userWithoutPermission) 
        return interaction.alphaReplyError(`**${events.src.userpermission} \`${userWithoutPermission}\`**`);

    if (!config.owners.includes(interaction.user.id) && userResult.ban) 
        return interaction.alphaReplyError(`**${(events.src.userbanned).replace('{{client}}', client.user.username)}**`)

    return true;
}