// code away!
require('dotenv').config()
const server = require('./server')

let port = process.env.PORT || 4000
server.listen(port, _ =>
{
    console.log(`Server listening on port ${port}`)
})