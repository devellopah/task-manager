const request = require('supertest')
const app = require('../src/app')

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