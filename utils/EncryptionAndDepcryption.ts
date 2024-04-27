import JSENENCRYPT from "jsencrypt";

const jse = new JSENENCRYPT();

export const encryptData = async (data: string) => {
  await jse.setPublicKey(process.env.PUBLIC_KEY!);
  const encrypted = await jse.encrypt(data);

  return encrypted;
};

export const decryptData = async (data: string) => {
  await jse.setPrivateKey(process.env.PRIVATE_KEY!);
  const decryptData = await jse.decrypt(data);
  return decryptData;
};
