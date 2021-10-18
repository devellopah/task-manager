const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@mail.com',
  password: 'mikemike',
  tokens:[{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
}

beforeEach(async () => {
  await User.deleteMany()
  await new User(userOne).save()
})

test('should sign up a new user', async () => {
  const response = await request(app)
    .post('/users/signup')
    .send({
      name: 'Tomas',
      email: 'tomastomas@mail.com',
      password: 'tomastomas',
    })
    .expect(201)

  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    user: {
      name: 'Tomas',
      email: 'tomastomas@mail.com',
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe('tomastomas')
})
test('should log in existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200)

  const user = await User.findById(userOne._id)
  expect(response.body.token).toBe(user.tokens[1].token)
})
test('should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'nonexistent@mail.com',
      password: 'nonexistent',
    })
    .expect(400)
})
test('should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(userOne._id)
  expect(user).toBeNull()
})

test('should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
  const name = 'Tony'
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name })
    .expect(200)

    const user  = await User.findById(userOne._id)
    expect(user.name).toBe(name)
})