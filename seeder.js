// const fs = require('fs')
const mongoose = require('mongoose')

// const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/.env' })

// Load Modles

const Board = require('./models/Board')
const List = require('./models/List')
const Card = require('./models/Card')
const User = require('./models/user')
const Attachment = require('./models/Attachment')

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI)
  console.log(`🍃 MongoDB connected:  ${conn.connection.host} 🍃 `)
}
connectDB()

// // read json file for bootcamps
// const bootcamps = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/bootcamps.json`),
//   'utf-8'
// )
// // read json file for Courses
// const courses = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/courses.json`),
//   'utf-8'
// )

// // read json file for users
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`),
//   'utf-8'
// )

// // read json file for reviews
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/reviews.json`),
//   'utf-8'
// )
// Import into db
const impotData = async () => {
  console.log('No data yet to be imported ')
  // try {
  //   await Bootcamp.create(bootcamps)
  //   await Course.create(courses)
  //   await User.create(users)
  //   await Review.create(reviews)
  //   console.log('data Imported to the db ...'.green.inverse)
  //   process.exit()
  // } catch (error) {
  //   console.error(error)
  // }
}

const deleteData = async () => {
  try {
    await User.deleteMany()
    await Board.deleteMany()
    await Attachment.deleteMany()
    await List.deleteMany()
    await Card.deleteMany()

    console.log('data Deleted from the db ...')
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

if (process.argv[2] === '-i') {
  impotData()
} else if (process.argv[2] === '-d') {
  deleteData()
}

// connectDB()
