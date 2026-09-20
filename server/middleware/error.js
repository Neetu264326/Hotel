const notFound = (req, res, next) => {
  res.status(404)
  next(new Error(`Route not found: ${req.originalUrl}`))
}

const errorHandler = (err, req, res, _next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500
  let message = err.message

  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid resource ID'
  }

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
  }

  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    message = `${field} already exists`
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}

export { notFound, errorHandler }