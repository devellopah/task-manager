const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/users/signup', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(item => item.token !== req.token)
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedForUpdate = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every(item => allowedForUpdate.includes(item))
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }
  try {
    updates.forEach(prop => req.user[prop] = req.body[prop])
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router