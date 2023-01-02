const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const path = require('path')
const Sequelize = require('./config/db')
const User = require('./models/User')
const userRoute = require('./routes/auth')
const sequelize = require('./config/db')

// connect the db
const syncDb = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Connection to the db is successful')
  } catch (err) {
    console.error(err)
  }
}

syncDb()

const app = express()
// const db = connectToDatabase()

// HTTP request logger middleware 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// loading the config files
dotenv.config({ path: './config/config.env' })

app.use(express.json())

app.post('/users', async (req,res) => {
  try {
    const newUser = await User.create(req.body)
    res.send('A new user has been created and inserted successfully')
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get('/users', async (req, res) => {
  const users= await User.findAll()
  res.send(users)
})

const port = process.env.PORT || 3000

// server running in either
// production or development mode
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${port}`)
})