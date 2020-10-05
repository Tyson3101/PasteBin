require('dotenv').config()
const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const {
     differenceInDays,
     differenceInHours,
     differenceInMinutes,
     differenceInWeeks,
     differenceInMonths,
     differenceInYears
} = require('date-fns')
const PORT = process.env.PORT || 5000;
const dbRouter = require(`${__dirname}/database/routeToDbInfo`);
app.use('/info/bin', dbRouter)
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'public/views'))

const databaseURL = `${__dirname}/database/database.json`
let databaseData = JSON.parse(fs.readFileSync(databaseURL))

app.get('/', (req, res) => {
     res.render('index')
})

app.get('/create', (req, res) => {
     res.render('create')
})

app.get('/bin/:BinID', (req, res) => {
     let fullPath = req.protocol + '://' + req.get('host') + req.originalUrl;
     databaseData = JSON.parse(fs.readFileSync(databaseURL))
     console.log(databaseData)
     let BinID = parseInt(req.params.BinID);
     console.log(BinID)
     if (!databaseData.some(a => a['binID'] === BinID)) {
          return res.render('notFound')
     }
     let obj = databaseData.find(a => a['binID'] === BinID)
     let text = obj.text;

     res.render('bin', {
          'text': text,
          'path': fullPath,
          'obj': obj,
          'time': time(obj.createdAt, new Date(Date.now()))
     })
})

app.post('/create', (req, res) => {
     databaseData = JSON.parse(fs.readFileSync(databaseURL))
     let id = databaseData[0].currentID;
     databaseData[0].binsCount += 1;
     databaseData[0].currentID = id += 1;
     const toPush = {
          type: 'SaveText',
          binID: id,
          createdAt: Date.now(),
          text: req.body.text
     }
     databaseData.push(toPush)
     fs.writeFileSync(databaseURL, JSON.stringify(databaseData, null, 3))
     res.sendStatus(200)
})

app.get('*', (req, res) => {
     res.render('notFound')
})

function time(pastTime, nowTime) {
     let past = new Date(pastTime);
     let now = new Date(nowTime);
     let years = differenceInYears(now, past)
     let months = differenceInMonths(now, past)
     let weeks = differenceInWeeks(now, past)
     let days = differenceInDays(now, past)
     let hours = differenceInHours(now, past)
     let minutes = differenceInMinutes(now, past)
     if (years >= 1) {
          if (years === 1) return `${years} Year ago`;
          else return `${years} Years ago`;
     } else if (months >= 1) {
          if (months === 1) return `${months} Month ago`;
          else return `${months} Months ago`;
     } else if (weeks >= 1) {
          if (weeks === 1) return `${weeks} Week ago`;
          else return `${weeks} Weeks ago`;
     } else if (days >= 1) {
          if (days === 1) return `${days} Day ago`;
          else return `${days} Days ago`;
     } else if (hours >= 1) {
          if (hours === 1) return `${hours} Hour ago`;
          else return `${hours} Hours ago`;
     } else if (minutes >= 1) {
          if (minutes === 1) return `${minutes} Minute ago`
          else return `${minutes} Minutes ago`
     } else {
          return `Just Now`
     }
}

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))