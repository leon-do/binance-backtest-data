// https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=15m&limit=1000&endTime=1531679400000
const axios = require('axios')
const fs = require('fs')

start()
async function start() {
    // create empty file and prep the array
    fs.writeFileSync('data.json', '[')
    // set a candle interval
    const interval = process.argv[2] || '15m'
    // start now and work backwords
    let endTime = Date.now()
    try {
        // continue until there's an error | !data
        while (true) {
            const url = `https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=${interval}&limit=1000&endTime=${endTime}`
            const data = await axios.get(url).then(response => response.data)
            if (data.legnth === 0) {
                throw 'my-tickt-out-of-hell'
            }
            // append data
            fs.appendFileSync('data.json', ',' + JSON.stringify(data, null, 2).slice(1, -1))
            // update endTime
            endTime = data[0][0]
            // give binance a 5 second break
            await delay(5000)
        }
    } catch (e) {
        console.log(e)
        // complinish the array ]
        fs.appendFileSync('data.json', ']')
    }
}

function delay(_ms) {
    return new Promise(res => {
        setTimeout(() => {
            res({})
        }, _ms)
    })
}
