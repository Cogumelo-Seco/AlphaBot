const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const Functions = require('../../../structures/functions/index');

module.exports = class extends Functions {
    constructor(props) {
        super(props);

		this.slashOptions =  [
            {
                name: 'cidade',
                description: 'Adicione um nome de cidade para ver informações',
                required: true,
                type: 3
            }
        ];
		this.clientPermissionLevel = [26]
        this.name = ['weather', 'clima'];
        this.helpen = 'Get weather information for a specific city';
        this.help = 'Obtenha informações de clima sobre determinada cidade';
		this.usageExample = 'https://cdn.discordapp.com/attachments/912493391927988236/985582749861683261/unknown.png'
		this.howToUsePT = '[nome da cidade]'
        this.howToUseEN = '[name of the city]'
    }

    async run(message) {
        let query = this.args.join(' ')
		if(!query) return message.alphaReplyError(this.events.commands.noargs)
		let href = await this.search(query)

		if (href) {
			let split = href.weather[0].description.split('')
			let climate = split[0].toUpperCase() + split.slice(1).join('')

			const embed = new MessageEmbed()
				.setColor(this.config.botColor1)
				.setThumbnail(`https://openweathermap.org/img/wn/${href.weather[0].icon}@2x.png`)
				.setTitle(`${this.structure.weather.embed_title} ${href.name}, ${href.sys.country}`)
				.setDescription(`**${this.structure.weather.climate}: \`${climate}\`\n\n🌡️ ${this.structure.weather.temperature}:\n${this.structure.weather.currentTemperature}: \`${(href.main.temp - 273.15).toFixed(2)}°C | ${(href.main.temp - 222.358).toFixed(2)}°F\`\n${this.structure.weather.temperatureMin}: \`${(href.main.temp_min - 273.15).toFixed(2)}°C | ${(href.main.temp_min - 222.358).toFixed(2)}°F\`\n${this.structure.weather.temperatureMax}: \`${(href.main.temp_max - 273.15).toFixed(2)}°C | ${(href.main.temp_max - 222.358).toFixed(2)}°F\`\n${this.structure.weather.sensation}: \`${(href.main.feels_like - 273.15).toFixed(2)}°C | ${(href.main.feels_like - 222.358).toFixed(2)}°F\`\n\n💧 ${this.structure.weather.humidity}: \`${href.main.humidity}%\`\n🌬️ ${this.structure.weather.wind}: \`${href.wind.speed} Km/h\`\n🌎 ${this.structure.weather.pressure}: \`${href.main.pressure} hPa\`**`)
				.setFooter({ text: "Powered by OpenWeather" })
			return message.alphaReply({ embeds: [embed] })
			
		} else {
			let href = await this.search2(query, message)
			let climate = href.results.forecast[0]

			const embed = new MessageEmbed()
				.setColor(this.config.botColor1)
				.setThumbnail(`https://openweathermap.org/img/wn/${href.results.img_id}@2x.png`)
				.setTitle(`${this.structure.weather.embed_title} ${href.results.city}`)
				.setDescription(`**${this.structure.weather.date}: \`${climate.date}, ${climate.weekday}\`\n${this.structure.weather.climate}: \`${climate.description}\`\n\n🌡️ ${this.structure.weather.temperature}:\n${this.structure.weather.currentTemperature}: \`${href.results.temp}°C | ${((href.results.temp)*1.8000+32.00).toFixed(2)}°F\`\n${this.structure.weather.temperatureMin}: \`${climate.min}°C | ${((climate.min)*1.8000+32.00).toFixed(2)}°F\`\n${this.structure.weather.temperatureMax}: \`${climate.max}°C | ${((climate.max)*1.8000+32.00).toFixed(2)}°F\`\n\n💧 ${this.structure.weather.humidity}: \`${href.results.humidity}%\`\n🌬️ ${this.structure.weather.wind}: \`${href.results.wind_speedy}\`**`)
				.setFooter({ text: "Powered by HG Brasil" })
			return message.alphaReply({ embeds: [embed] })
		}
    }

	async search(query) {
		let lang = this.structure.type == 'pt-BR' ? 'pt_br' : 'un'
		const { body } = await request.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&lang=${lang}&appid=${this.config.WEATHER_KEY}`).then().catch(() => {
			return 'null'
		});

		if(!body) return null
		return body
	}

	async search2(query, message) {
		const { body }  = await request.get(`https://api.hgbrasil.com/weather?key=${this.config.WEATHER_KEY2}&city_name=${query}`).then().catch(() => {
			return message.alphaReplyError((this.structure.weather.noFind).replace('{{query}}', query))
		});

		if(!body) return null
		return body
	}
}