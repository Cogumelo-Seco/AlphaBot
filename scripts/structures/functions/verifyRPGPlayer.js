const { isNumber } = require("mathjs");

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(user) {
        const userResult = await this.client.schemas['user'].findById(user?.id);
        if (!userResult) return null

        let player = {
            totalLife: 100,
            totalMana: 100,
            life: 100,
            mana: 100,
            attack: 10,
            rest: '0-A',
            xp: 0,
            level: 1,
            monster: null,
            items: {
                equipped: [],
                usable: [],
                unusable: []
            },
            attacks: [
                {
                    name: 'Mãozinha',
                    name_EN: 'Little hand',
                    damage: 0
                },
                {
                    name: 'Pedrada',
                    name_EN: 'Throw stone',
                    damage: 1.5
                },
                {
                    name: 'Espada',
                    name_EN: 'Sword',
                    damage: 2
                }
            ],
            addXP: (amount, player) => {
                if (!Number(amount)) return
                player.xp += amount
                player.totalXP += amount

                let requiredXP = Math.floor(15 * player.level ** 2 + 50 * player.level + 100)

                if (player.xp >= requiredXP) {
                    player.level += 1
                    player.xp = requiredXP-player.xp > 0 ? requiredXP-player.xp || 0 : 0

                    player.totalLife += 20
                    player.totalMana += 25
                    player.attack += 5

                    this.message[this.message.followUp ? 'followUp' : 'reply']({ ephemeral: true, content: this.events.RPG.levelUP
                        .replace('{{level}}', player.level)
                        .replace('{{maxHP}}', player.totalLife)
                        .replace('{{maxMana}}', player.totalMana)
                        .replace('{{attack}}', player.attack)
                    }).catch(() => null)
                }

                return player
            }
        }

        for (let i in userResult.RPGPlayer) {
            if (typeof player[i] == 'object' && typeof userResult.RPGPlayer[i] == 'object') {
                try {
                    if (player[i]) user.RPGPlayer[i] = Object.assign(player[i], userResult.RPGPlayer[i])
                } catch (e) {}      
            } else player[i] = userResult.RPGPlayer[i]  
        }

        for (let i in player) {
            if (Number(player[i]) && player[i] <= 0) player[i] = 1
        }

        if (player.totalXP != 0 && !player.totalXP) {
            player.totalXP = 0
            for (let i = 0;i < player.level; i++) {
                player.xp = 0
                player.totalXP += Math.floor(15 * i ** 2 + 50 * i + 100)
            }
        }

        userResult.RPGPlayer = player
        userResult.save()

        return userResult.RPGPlayer
    }
}