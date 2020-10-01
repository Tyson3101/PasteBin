require('dotenv').config()
const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 5000;
const dbRouter = require('../src/database/routeToDbInfo');
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
     let text = databaseData.find(a => a['binID'] === BinID).text;
     res.render('bin', {
          'text': text,
          'path': fullPath,
          'obj': databaseData.find(a => a['binID'] === BinID)
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
          text: req.body.text
     }
     databaseData.push(toPush)
     fs.writeFileSync(databaseURL, JSON.stringify(databaseData, null, 3))
     res.sendStatus(200)
})

app.get('*', (req, res) => {
     res.render('notFound')
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))