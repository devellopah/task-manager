const express = require('express')
const User = require('../models/user')

const router = new express.Router

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    res.status(500).send()
  }
})
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (err) {
    res.status(500).send()
  }
})
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    res.send(user)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedForUpdate = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every(item => allowedForUpdate.includes(item))
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }
  try {
    const user = await User.findById(req.params.id)
    updates.forEach(prop => user[prop] = req.body[prop])
    await user.save()
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false })
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).send()
    }
    res.send(`You have just deleted user: ${user.name}`)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router