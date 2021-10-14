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
  await request(app)
    .post('/users')
    .send({
      name: 'Tomas',
      email: 'tomastomas@mail.com',
      password: 'tomastomas',
    })
    .expect(201)
})
test('should log in existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200)
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
})

test('should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})