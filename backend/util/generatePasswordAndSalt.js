import bcrypt from 'bcryptjs'

export const generateSalt = async () => {
  return await bcrypt.genSalt()
}

export const generatePassword = async (password, salt) => {
  console.log('salt', salt)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}
