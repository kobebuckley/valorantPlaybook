import bcrypt from 'bcryptjs';

// Function to generate a hashed password
export async function generateHashedPassword(plainPassword: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}
