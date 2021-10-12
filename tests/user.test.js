const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
  name: 'Mike',
  email: 'mike@mail.com',
  password: 'mikemike'
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