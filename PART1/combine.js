const getJSON = require('get-json')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const figlet = require('figlet')

const outputFile = process.argv.slice(2)[0]
const dataDir = 'data/'

console.log(chalk.green(figlet.textSync('Bitcoin Chart Scraper', {
	font: 'Pepper',
	kerning: 'fitted'
})))
console.log(chalk.dim(`Combining data to=${chalk.yellow(outputFile)} \n`))

const files = []

function compare (a, b) {
	if (a.time < b.time) {
		return -1
	}

	if (a.time > b.time) {
		return 1
	}

	return 0
}

fs.readdir(dataDir, (err, list) => {
	list.forEach(file => {
		let date
		let time

		try {
			date = new Date(file.split('bitstampEUR-')[1].split('.json')[0])
			time = date.getTime()
		} catch (err) {
			return
		}

		if (!date) {
			return
		}

		files.push({
			file,
			date,
			time
		})
	})

	files.sort(compare)

	let combinedData = []

	process.stdout.write('\n')

	files.forEach(day => {
		const filePath = path.join(dataDir, day.file)
		const contents = fs.readFileSync(path.join(__dirname, filePath)).toString()
		const data = JSON.parse(contents)

		if (data.length > 0) {
 			combinedData = combinedData.concat(data)
		}
		process.stdout.write('.')
	})

	const outputData = JSON.stringify(combinedData)

	fs.writeFile(outputFile, outputData, 'utf8', err => {
		process.stdout.write('\n')

		if(err) {
			return console.error(chalk.red(err))
		} else {
			console.log(`Saved to: ${chalk.blue(outputFile)}`)
		}
	})
})