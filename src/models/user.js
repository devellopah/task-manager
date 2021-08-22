const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid!')
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      validate(value) {
        if (value.includes('password')) {
          throw new Error('Password cannot contain "password"!')
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a positive number!')
        }
      }
    }
  }
)
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email })

  if (!user) {
    throw new Error('Unable to login.')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login.')
  }
  return user
}
// hash the plain text password before saving
userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})
const User = mongoose.model('User', userSchema)

module.exports = User