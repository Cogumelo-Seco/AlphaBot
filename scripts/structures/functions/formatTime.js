module.exports = class {
    constructor(props) {
        for (let i in props) {
            this[i] = props[i]
        }
    }

    run(props) {
        let time = props[0]
        let type = props[1]
        let client = this.client || props[2]

        const formatting = client.moment.duration(time, "milliseconds");

        const keys = {
            year: formatting.years(),
            month: formatting.months(),
            day: formatting.days(),
            hour: formatting.hours(),
            minute: formatting.minutes(),
            second: formatting.seconds()
        };

        if (type == 1) {
            let timeText = ''
            let write = false
            let oldKey;
            for (const key in keys) {
                if (keys[key] != 0) write = true
                if (write) {
                    timeText  += `${oldKey ? ':' : ''}${keys[key]}`
                    oldKey = key
                }
            }
            if (!timeText.includes(':')) timeText += 's'
            return timeText
        } else {
            let timeText = ''
            let write = false
            for (const key in keys) {
                if (keys[key] != 0) write = true
                if (write) timeText  += `${keys[key]}${key.split('')[0]} `
            }
            return timeText.substring(0, timeText.length-1)
        }
    }
}