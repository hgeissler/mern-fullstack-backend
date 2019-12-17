const mongoose = require('mongoose')
const express = require('express')
let cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const Data = require('./data')

const API_PORT = 3001
const app = express()
app.use(cors())
const router = express.Router()

// mongoDB pw
let mongoPw = ''

// get password
router.post('/postPw', (req,res) => {
  mongoPw = req.body.password

  let dbRoute = 'mongodb+srv://hannes:' + mongoPw + '@mern-backend-t3i3y.mongodb.net/test?retryWrites=true&w=majority'

  // wait for password entry to start db connection
  // mongoDB Atlas Database
  mongoose.connect(dbRoute, { useNewUrlParser: true}, (err) => {
    console.log('mongo db connection', err)
    if (!err) {
      res.send('connected')
    }
  })
  
  let db = mongoose.connection
  
  db.once('open', (err) => console.log('connectected to database', err))
  db.on('error', console.error.bind(console, 'MongoDB connection error:'))
})


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(logger('dev'))


router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err})
    return res.json({ success: true, data: data})
  })
})

// update method
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err})
    return res.json({ success: true })
  })
})

router.delete('/deleteData', (req, res) => {
  const { id } = req.body
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err)
    return res.json({ success: true })
  })
})

// create method
router.post('/postData', (req,res) => {
  let data = new Data()
  const { id, message } = req.body
  console.log(req.body)
  if ((!id && id !== 0) || !message) {
    return res.json({ success: false, error: 'INVALID INPUTS' })
  }

  data.message = message
  data.id = id
  data.save((err) => {
    if (err) return res.json({ success: false, error: err})
    return res.json({ success: true})
  })
})

// append /api for our http-requests
// example: http://localhost:3001/api/getData
app.use('/api', router)

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`))

