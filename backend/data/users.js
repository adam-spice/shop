import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
  },
]
const generatePassword = () => {
  const salt = bcrypt.genSaltSync()
  const password = bcrypt.hashSync('123456', salt)
  return { password, salt }
}

export default users.map((user) => {
  const { password, salt } = generatePassword()
  return { ...user, password, salt }
})
