import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    salt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

userSchema.methods.matchPassword = async function (password) {
  const hash = await bcrypt.hash(password, this.salt)
  return hash === this.password
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  try {
    this.password = await bcrypt.hash(this.password, this.salt)
  } catch (error) {
    console.log('error :>> ', error)
  }
})

const User = mongoose.model('User', userSchema)

export default User
