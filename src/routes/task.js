const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router

router.get('/tasks', auth, async (req, res) => {
  const match = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true' ? true : false
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      }
    }).execPopulate()
    if (req.user.tasks.length) {
      res.send(req.user.tasks)
    } else {
      res.status(404).send()
    }
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedForUpdate = ['description', 'completed']
  const isValidOperation = updates.every(item => allowedForUpdate.includes(item))
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    updates.forEach(prop => task[prop] = req.body[prop])
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    await task.remove()
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router