require('dotenv').config()
const express = require('express')
const router = express.Router()
const fs = require('fs')

const databaseURL = `${__dirname}/database.json`
let databaseData = JSON.parse(fs.readFileSync(databaseURL))

router.get('/currentID', (req, res) => {
     databaseData = JSON.parse(fs.readFileSync(databaseURL))
     res.json({
          ...databaseData[0]
     })
})

router.get('/allData/:secretkey', (req, res) => {
     if (req.params['secretkey'] === process.env.secretDBKey) {
          databaseData = JSON.parse(fs.readFileSync(databaseURL))
          return res.json({
               ...databaseData[0]
          })
     } else {
          return res.sendStatus(401)
     }
})

module.exports = router;