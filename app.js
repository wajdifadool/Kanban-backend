// USED FOR TESTING
// app.js
const dotenv = require('dotenv')
dotenv.config({ path: './config/.env', quiet: true })

const express = require('express')

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

// Routes
const authRoutes = require('./routes/auth')
const boardRoutes = require('./routes/boardRoutes')
const listRoutes = require('./routes/listRoutes')
const cardRoutes = require('./routes/cardRoutes')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload()) // for uploading files
app.use(morgan('dev'))

// Make upload folder static (to serve uploaded files)
app.use(
  '/uploads',
  express.static(path.join(__dirname, process.env.FILE_UPLOAD_PATH))
)

/* ---- Routes ---- */
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/boards', boardRoutes)
app.use('/api/v1/boards/:boardId/lists', listRoutes)
app.use('/api/v1/lists', listRoutes)

app.use('/api/v1/cards', cardRoutes)

app.use(errorHandler)

module.exports = app
