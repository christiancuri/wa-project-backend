import bcrypt from "bcrypt";

const ROUNDS = 12;

export async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export async function compare(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function randomAlphaNumericCode(size: number): string {
  const alphaNumeric =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < size; i++)
    code += alphaNumeric.charAt(
      Math.floor(Math.random() * alphaNumeric.length),
    );
  return code;
}
