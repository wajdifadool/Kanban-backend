const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

// Routes
const authRoutes = require('./routes/auth')
const boardRoutes = require('./routes/boardRoutes')

dotenv.config({ path: './config/.env' })
connectDB()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.use(morgan('dev'))

/* ---- Routes ---- */
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/boards', boardRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Welcome to the homepage of your API!')
})
