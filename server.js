const express = require('express')
const userRouter = require('./users/userRouter')

const server = express()
server.use(express.json())

server.use(logger)
server.use('/api/users', userRouter)

server.get('/', (req, res) =>
{
    res.status(200).json({ message: "server is r" })
})

//custom middleware

function logger(req, res, next) {
  console.log(
      `[${new Date().toISOString()}] ${req.method} to ${req.url}`
  )
  next()
}

module.exports = server;
