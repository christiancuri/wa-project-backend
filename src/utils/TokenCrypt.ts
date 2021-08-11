import forge from "node-forge";

const vector = "QAZXSWEDCVFRTGBNHYUJMKIOLP";

export async function encrypt(id: string, str: string): Promise<string> {
  const key = generateHash(id);
  const encoded = await encryptText(key, str);
  return forge.util.encode64(`${key}$${encoded}`);
}

export async function decrypt(str: string): Promise<string> {
  const text = forge.util.decode64(str);
  if (!text.includes("$")) return undefined;
  const [key, encoded] = text.split("$");
  return decryptText(key, encoded);
}

export async function encryptText(key: string, str: string): Promise<string> {
  const cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: vector });
  cipher.update(forge.util.createBuffer(str));
  cipher.finish();
  return forge.util.encode64(cipher.output.data);
}

export async function decryptText(
  key: string,
  encoded: string,
): Promise<string> {
  const decoded = forge.util.decode64(encoded);
  const decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: vector });
  decipher.update(forge.util.createBuffer(decoded));
  decipher.finish();
  return decipher.output.data;
}

function generateHash(text: string): string {
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += text.charAt(Math.floor(Math.random() * text.length));
  }
  return result;
}
