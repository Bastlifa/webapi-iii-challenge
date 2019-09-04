// code away!
const express = require('express')
const userRouter = require('./users/userRouter')


const server = express()
server.use(express.json())
server.use('/api/users', userRouter)

function logger(req, res, next) {
    console.log(
        `[${new Date().toISOString()}] ${req.method} to ${req.url}`
    )
    next()
}

server.get('/', (req, res) =>
{
    res.status(200).json({ message: "server is running" })
})



server.use(logger)


server.listen(5000, _ =>
{
    console.log(`Server listening on port ${5000}`)
})