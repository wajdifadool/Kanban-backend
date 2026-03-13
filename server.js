const express = require('express')
const dotenv = require('dotenv')
dotenv.config({ path: './config/.env' })
// abc
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const app = express()
const passport = require('passport') // For google auth
// const http = require('http') // Import http module for WebSocket

// Create HTTP server for WebSocket
// const server = http.createServer(app)

// // Initialize socket.io
// const io = require('socket.io')(server, {
//   cors: {
//     origin: "*",  // Allow all origins (you can restrict this for security)
//     methods: ["GET", "POST"]
//   }
// })

// initialize socket manager (creates io and export)
// const { initSocket } = require('./sockets/socketManager')
// const io = initSocket(server)
// Make io available globally if you want (optional)
// require('./sockets/socketManager').getIo = () => io;

// require listeners AFTER socketManager init so they can use socketManager
require('./events') // index file that imports all listeners
require('./passport') // must be before passport.use()
app.use(passport.initialize())

// Routes
const authRoutes = require('./routes/auth')
const boardRoutes = require('./routes/boardRoutes')
const listRoutes = require('./routes/listRoutes')
const cardRoutes = require('./routes/cardRoutes')

connectDB()

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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Welcome to the homepage of your API!')
})
