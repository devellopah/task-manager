const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

const app = express()

const port = process.env.PORT || 3000

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