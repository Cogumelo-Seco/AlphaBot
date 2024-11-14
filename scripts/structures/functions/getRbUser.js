const noblox = require("noblox.js")

module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    async run(props) {
        let info = await noblox.getPlayerInfo({ userId: props[0] }).catch(() => null)
        let id = await noblox.getIdFromUsername(String(props[0])).catch(() => null)
        if (!id) return

        if (!info) info = await noblox.getPlayerInfo({ userId: id })
        let thumbnail_default = await noblox.getPlayerThumbnail(id)
        let thumbnail_circHeadshot = await noblox.getPlayerThumbnail(id, 420, "png", true, "Headshot")

        info.id = id
        info.thumbnail_default = thumbnail_default
        info.thumbnail_circHeadshot = thumbnail_circHeadshot

        return info
    }
}