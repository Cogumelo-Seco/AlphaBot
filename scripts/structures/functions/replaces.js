module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    run(props) {
        let avatar = props[1] ? props[1].avatarURL({ dynamic: true, format: "png"}) || this.randomAvatar() : null

        if (!props[0] || !props[0].replace) return props[0]
        
        var txt = props[0]
            .replace(/{guildMemberCount}/g, props[2] ? props[2].memberCount : null)
            .replace(/{guildName}/g, props[2] ? props[2].name : null)
            .replace(/{date}/g, new Date())
            .replace(/{avatar}/g, avatar)

            .replace(/{@member}/g, props[1] && props[1].id ? props[1] : null)
            .replace(/{member}/g, props[1] && props[1].id ? props[1].username : null)
            .replace(/{memberTag}/g, props[1] && props[1].id ? props[1].tag : null)
            .replace(/{memberId}/g, props[1] && props[1].id ? props[1].id : null)

            .replace(/{lv}/g, props[3] ? props[3].level : null)

            .replace(/DEFAULT-COLOR/g, process.env.botColor1)

        return txt
    }
}