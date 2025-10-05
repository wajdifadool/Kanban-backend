const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  console.log('error called  ... ')
  // console.log(error)

  if (err.name === 'CastError') {
    error = new ErrorResponse(`Resource not found with id of ${err.value}`, 404)
  }

  if (err.code === 11000) {
    /*
     * cases when this called :
     * on register if entered the same eamil, 👉 Best practice for duplicate registration: use 409 Conflict. //TODO: change for better message for duplicate email
     */
    const message = 'Duplicate field value entered'
    error = new ErrorResponse(message, 400)
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  })
}

module.exports = errorHandler
