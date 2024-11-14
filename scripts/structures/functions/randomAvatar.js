module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    run() {
        let random = Math.floor(Math.random()*6)
        return `https://cdn.discordapp.com/embed/avatars/${random}.png`
    }
}