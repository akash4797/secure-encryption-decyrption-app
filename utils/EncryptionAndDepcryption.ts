import * as jose from "jose";

let PRIVATE_KEY: any = null;
let PUBLIC_KEY: any = null;
const alg = "RSA-OAEP-256";

const imoprtKeys = async () => {
  PUBLIC_KEY = await jose.importSPKI(process.env.PUBLIC_KEY || "", alg);
  PRIVATE_KEY = await jose.importPKCS8(process.env.PRIVATE_KEY || "", alg);
};

export const encryptData = async (data: string) => {
  await imoprtKeys();
  const encrypted = await new jose.CompactEncrypt(
    new TextEncoder().encode(data)
  )
    .setProtectedHeader({
      alg: alg,
      enc: "A256GCM",
    })
    .encrypt(PUBLIC_KEY);
  return encrypted;
};

export const decryptData = async (data: string) => {
  await imoprtKeys();
  const { plaintext } = await jose.compactDecrypt(data, PRIVATE_KEY);
  return new TextDecoder().decode(plaintext);
};
