// src/lib/auth.ts
import { hash, compare } from 'bcrypt-ts';

const HASH_SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, HASH_SALT_ROUNDS);
  return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}