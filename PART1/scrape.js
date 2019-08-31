const getJSON = require('get-json')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const figlet = require('figlet')

const maxstreams = 4
const dataDir = 'data'

const market = 'bitstampEUR'
const dates = {
	from: {
		year: 2019,
		month: 8,
		day: 1
	},
  
	to: {
		year: 2019,
		month: 08,
		day: 6
	},
  }
  
const baseApiUrl = 'http://bitcoincharts.com/charts/chart.json?'

// Full parms: m=bitstampEUR&SubmitButton=Draw&r=60&i=5-min&c=1&s=2011-09-14&e=2011-09-14&Prev=&Next=&t=S&b=&a1=&m1=10&a2=&m2=25&x=0&i1=&i2=&i3=&i4=&v=1&cv=0&ps=0&l=0&p=0&
const formatApiUrl = (market, date) => {
	const apiUrl = `${baseApiUrl}m=${market}&SubmitButton=Draw&r=60&i=5-min&c=1&s=${date}&e=${date}&Prev=&Next=&t=S&b=&a1=&m1=10&a2=&m2=25&x=0&i1=&i2=&i3=&i4=&v=1&cv=0&ps=0&l=0&p=0&`
	return apiUrl
}

console.log(chalk.green(figlet.textSync('Bitcoin Chart Scraper', {
	font: 'Pepper',
	kerning: 'fitted'
})))
console.log(chalk.dim(`Running with maxstreams=${chalk.yellow(maxstreams)} \n`))

const url = (baseurl, date) => {
  return baseurl + date
}

Date.prototype.addDays = function(days) {
  const dat = new Date(this.valueOf())
  dat.setDate(dat.getDate() + days)
  return dat
}

const getDates = (startDate, stopDate) => {
  const dateArray = new Array()
  let currentDate = startDate
  while (currentDate <= stopDate) {
    dateArray.push(currentDate)
    currentDate = currentDate.addDays(1)
  }
  return dateArray
}

const start = new Date(dates.from.year, dates.from.month - 1, dates.from.day)
const end = new Date(dates.to.year, dates.to.month - 1, dates.to.day)
const dateStack = getDates(start, end)

const go = () => new Promise((resolve, reject) => {
	if (dateStack.length === 0) {
		return resolve('Done!')
	}

	const pipeline = []

	for (let i = 0; i < maxstreams; i += 1) {
		const date = dateStack.shift()

		if (!date) {
			continue
		}

		const prettyDate = date.getFullYear() + '-' + (date.getUTCMonth()+1) + '-' + date.getUTCDate()
		const dataPath = formatApiUrl(market, prettyDate)
		const fileName = `${market}-${prettyDate}.json`
		const filePath = path.join(dataDir, fileName)

		// Don't re-download if thie file already exists
		if (fs.existsSync(filePath)) {
			console.log(`Passover: ${chalk.magenta(filePath)} (already exists)`)
			continue
		}

		pipeline.push(new Promise((resolve, reject) => {
			console.log(`Fetching: ${chalk.yellow(prettyDate)} - ${chalk.yellow.dim(dataPath)}`)

			getJSON(dataPath, (error, response) => {
				
				let cursoryEur = null

				if (response !== undefined) {
					cursoryEur = response[0][7]
				}
					console.log(`Recevied: ${chalk.green(prettyDate)} - ${chalk.red('$' + cursoryEur)}`)

				if (response === undefined) {
					console.log(chalk.red(`Received "Undefined" data for ${chalk.white(prettyDate)}. Too many streams? (Data for ome dates are not avilable, eg: '2011-10-1')`))
					response = []
				}

				for (i = 0; i < Object.keys(response).length; i++) {
					 delete response[i][7];
					 delete response[i][6];					
				  }
				  
				 
				console.log(Object.keys(response).length)
				const output = JSON.stringify(response)

				fs.writeFile(filePath, output, 'utf8', err => {
					if(err) {
						return reject(err)
					} else {
						console.log(`Saved to: ${chalk.blue(filePath)}`)
						resolve('Ok')
					}
				})
			})
		}))
	}

	Promise.all(pipeline).then(() => {
		resolve(go())
	}).catch(err => {
		reject(err)
	})
})

go().then(() => {
	console.log(chalk.magenta('DONE!'))
}).catch(err => {
	console.error(err)
})

