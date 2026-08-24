import bcrypt from "bcryptjs";

// bcryptjs (pure JS, no native bindings) rather than bcrypt — avoids needing
// node-gyp/a C++ toolchain to build a native module on every dev machine.
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
