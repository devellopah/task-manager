const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

const app = express()
const port = process.env.PORT || 3000

const enableMaintenanceMode = function(req ,res, next) {
  res.status(503).send('Site is currently down. Please, check back soon!')
}

app.use(enableMaintenanceMode)

app.use(express.json())
app.set('port', port)

app.use(userRouter)
app.use(taskRouter)

app.get('/', (_, res) => {
  res.send('hello')
})

app.listen(port, () => {
  console.log('running server on port ' + port)
})