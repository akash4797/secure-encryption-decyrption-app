import * as jose from "jose";

let PRIVATE_KEY: any = null; // private key
let PUBLIC_KEY: any = null; // public key
const alg = "RSA-OAEP-256"; // algorithm to be used

/* 
This function, imoprtKeys, is responsible for importing public and private keys from environment variables.
It uses the jose library to perform the key imports.
The function awaits the completion of the key imports, and then assigns the imported keys to the PUBLIC_KEY and PRIVATE_KEY variables.

The PUBLIC_KEY is imported using the importSPKI function, which imports a public key from a string in SubjectPublicKeyInfo (SPKI) format and the specified algorithm.
The private key is imported using the importPKCS8 function, which imports a private key from a string in PKCS #8 format and the specified algorithm.

The keys are imported from the environment variables, which should contain the keys in string format.
If the environment variables are not set, an empty string is used instead.

The keys are imported using the RSA-OAEP-256 algorithm, which is specified as a constant at the top of the file.
*/
const imoprtKeys = async () => {
  // Import the public key from the environment variable, or an empty string if not set
  PUBLIC_KEY = await jose.importSPKI(process.env.PUBLIC_KEY || "", alg);
  // Import the private key from the environment variable, or an empty string if not set
  PRIVATE_KEY = await jose.importPKCS8(process.env.PRIVATE_KEY || "", alg);
};

/* 
This function, encryptData, is responsible for encrypting data.
It uses the jose library to perform the encryption.
The function awaits the completion of the key import, which is handled by the imoprtKeys function.
Once the keys are imported, the function creates a new instance of CompactEncrypt, which is used to perform the encryption.

The function sets the protectedHeader of the CompactEncrypt instance to specify the algorithm and encryption method to be used.
The data to be encrypted is then passed to the encrypt function of the CompactEncrypt instance, which takes the public key as an argument.
The encrypted data is returned by the encryptData function.
*/
export const encryptData = async (data: string) => {
  // Import the keys from the environment variables
  await imoprtKeys();
  // Create a new instance of CompactEncrypt, which is used to perform the encryption
  const encrypted = await new jose.CompactEncrypt(
    // Encode the data to be encrypted as Uint8Array
    new TextEncoder().encode(data)
  )
    // Set the protectedHeader of the CompactEncrypt instance to specify the algorithm and encryption method to be used
    .setProtectedHeader({
      alg: alg, // Algorithm to be used, specified as a constant at the top of the file
      enc: "A256GCM", // Encryption method to be used
    })
    // Encrypt the data using the public key
    .encrypt(PUBLIC_KEY);
  // Return the encrypted data
  return encrypted;
};

/*
This function, decryptData, is responsible for decrypting encrypted data.
It uses the jose library to perform the decryption.
The function awaits the completion of the key import, which is handled by the imoprtKeys function.
Once the keys are imported, the function uses compactDecrypt function of jose to decrypt the data.
The compactDecrypt function takes the data to be decrypted and the private key as arguments.
The function returns an object, which has a property named "plaintext".
The plaintext is decrypted data, which is returned by the decryptData function.
*/
export const decryptData = async (data: string) => {
  // Import the keys from the environment variables
  await imoprtKeys();
  // Use compactDecrypt function of jose to decrypt the data
  // The compactDecrypt function takes the data to be decrypted and the private key as arguments
  // It returns an object, which has a property named "plaintext"
  const { plaintext } = await jose.compactDecrypt(data, PRIVATE_KEY);
  // Decode the decrypted data from Uint8Array to string
  // The decrypted data is returned by the decryptData function
  return new TextDecoder().decode(plaintext);
};
