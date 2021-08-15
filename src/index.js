const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.set('port', port)

app.get('/', (_, res) => {
  res.send('hello')
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch(err) {
    res.status(500).send()
  }
})
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch(err) {
    res.status(500).send()
  }
})
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).send(user)
  } catch(err) {
    res.status(400).send(err)
  }
})

app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedForUpdate = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every(item => allowedForUpdate.includes(item))
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true, runValidators: true })
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch(err) {
    res.status(400).send(err)
  }
})

app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.status(201).send(task)
  } catch(err) {
      res.status(400).send(err)
  }
})

app.listen(port, () => {
  console.log('running server on port ' + port)
})