module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    run(prop) {
        let number = Number(prop)
        if (Math.floor(number/1000000000000) > 0) return Math.floor(number/1000000000000)+'Tri'
        if (Math.floor(number/1000000000) > 0) return Math.floor(number/1000000000)+'Bi'
        if (Math.floor(number/1000000) > 0) return Math.floor(number/1000000)+'Mi'
        if (Math.floor(number/1000) > 0) return Math.floor(number/1000)+'Mil'
        return number
    }
}