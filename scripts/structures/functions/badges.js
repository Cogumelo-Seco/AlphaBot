module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(props) {
        let user = props[0]
        let message = props[1]
        let config = props[2]
        
        const Badges = require('../configs/Badges')

        var EmojisBadges = '';
        var userFlags = user.flags ? user.flags.toArray() : [];
        if (user.guild == message.guild) userFlags = user.user.flags ? user.user.flags.toArray() : [];

    
        if (userFlags && userFlags.length > 0) {
            userFlags.forEach((flag) => {
                switch (flag) {
                    case 'HOUSE_BRAVERY':
                        EmojisBadges += `${Badges[1].emoji} `;
                        break;
                    case 'HOUSE_BRILLIANCE':
                        EmojisBadges += `${Badges[2].emoji} `;
                        break;
                    case 'HOUSE_BALANCE':
                        EmojisBadges += `${Badges[3].emoji} `;
                        break;
                    case 'EARLY_VERIFIED_BOT_DEVELOPER':
                        EmojisBadges += `${Badges[4].emoji} `;
                        break;
                    case 'EARLY_SUPPORTER':
                        EmojisBadges += `${Badges[5].emoji} `;
                        break;
                    case 'BUGHUNTER_LEVEL_1':
                        EmojisBadges += `${Badges[6].emoji} `;
                        break;
                    case 'HYPESQUAD_EVENTS':
                        EmojisBadges += `${Badges[7].emoji} `;
                        break;
                    case 'DISCORD_EMPLOYEE':
                        EmojisBadges += `${Badges[8].emoji} `;
                        break;
                    case "VERIFIED_BOT":
                        EmojisBadges += `${Badges[9].emoji} `;
                        break;
                    case "PARTNERED_SERVER_OWNER":
                        //EmojisBadges += `${Badges[12].emoji} `;
                        break;
                    case "DISCORD_PARTNER":
                        EmojisBadges += `${Badges[12].emoji} `;
                        break;
					case "DISCORD_CERTIFIED_MODERATOR":
                        EmojisBadges += `${Badges[13].emoji} `;
                        break;
                }
            });
        }
    
        let result1 = await this.client.schemas['user'].find().sort([['bank', 'descending']]).limit(1)
        let result2 = await this.client.schemas['user'].find().sort([['commandsCounter', 'descending']]).limit(1)
        let result3 = await this.client.schemas['user'].find().sort([['voteCounter', 'descending']]).limit(1)
        let result4 = await this.client.schemas['user'].findById(user.id);
        let result5 = await this.client.schemas['user'].find().sort([['magicstones', 'descending']]).limit(1)
        let result6 = await this.client.schemas['user'].find().sort([['RPGPlayer.totalXP', 'descending']]).limit(1)

        if (result4 && result4.marryID != 'off') EmojisBadges += `${Badges[11].emoji} `;
        if (result1[0]._id == user.id) EmojisBadges += `${Badges[10].emoji} `;
        if (result2[0]._id == user.id) EmojisBadges += `${Badges[10].emoji} `;
        if (result3[0]._id == user.id) EmojisBadges += `${Badges[10].emoji} `;
        if (result5[0]._id == user.id) EmojisBadges += `${Badges[10].emoji} `;
        if (result6[0]._id == user.id) EmojisBadges += `${Badges[10].emoji} `;

        if (config.owners.includes(user.id)) EmojisBadges += `${Badges[0].emoji} `;
    
        return EmojisBadges;
    }
}