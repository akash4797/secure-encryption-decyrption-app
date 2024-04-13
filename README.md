## This is a web application that allows users to login and register to the system. Users can post/view using encryption and decryption.

**Developing an web applicaation with the following features:**

1. There will be 2 options: Login and Register. Users can login/ Register to the system.
2. While registering, userinfo should be encrypted (while storing) and decrypted (while viewing).
3. Password should be hashed and salted before storing in the database.
4. Separate function for credential check.
5. A key management module should be defined.
6. Users can post/view using encryption and decryption.
7. Every major piece of information in the database should be encrypted. Le. if an attacker has access to the database, unable to retrieve any data.

**Stack and technology i used to develop this application are nextjs, typescript, tailwindcss, mysql, bcryptjs, jwt, prisma, and jose.**

Feature 1:
Login and Register. -> routes are defined in app/(login|register)/page.tsx

Feature 2:
Userinfo should be encrypted (while storing) and decrypted (while viewing). -> used jose to encrypt and decrypt

Feature 3:
Password should be hashed and salted before storing in the database. -> hashPassword function is defined in utils/auth.ts

Feature 4:
Separate function for credential check. -> comparePasswords function is defined in utils/auth.ts

Feature 5:
A key management module should be defined. -> generateJWT function is defined in utils/auth.ts also Private and Public keys are defined in .env.local file.

Feature 6:
Users can post/view using encryption and decryption. -> EncryptionAndDecryption function is defined in utils/EncryptionAndDepcryption.ts

Feature 7:
Every major piece of information in the database should be encrypted. Le. if an attacker has access to the database, unable to retrieve any data. -> Check Database Encryption.

### Application Installation Steps

1. Install dependencies using Yarn:
   ```sh
   yarn install
   ```
2. Set up MySQL database using XAMPP and phpMyAdmin.:

- Create a database using the following command in the MySQL console:
  ```sql
  CREATE DATABASE secureauth;
  ```
- Get the username and password from phpMyAdmin and create an URL to connect to the database. For example:
  ```sql
  mysql://username:password@localhost/secureauth
  ```

3. Private and Public Keys.:

- Run the following command in the terminal to generate the private and public keys [the keys are on RSA-OAEP-256 encryption] then the key will be saved in your current directory [Optional if you want to use mine which is given in the .env.example file]:
  ```sh
  openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -pkeyopt rsa_keygen_pubexp:65537 -out private_key.pem
  openssl rsa -in private_key.pem -pubout -out public_key.pem
  ```

4. Setup .env.local file:

- Create a .env.local file in the root directory of the project.

- Write the following contents or follow .env.example file:

  ```sh
  DATABASE_URL=mysql://username:password@localhost/secureauth
  JWT_SECRET="secret"
  ```

- Copy the Public and the Private key that you generated and paste it to the .env.local file. Or if you want my key use mine.

5. Install dotenv-cli in global:

- Run the following command in the terminal to install dotenv-cli in global:
  ```sh
  npm install -g dotenv-cli
  ```

6. Generate Prisma Client:

- Run the following command in the terminal to generate the Prisma client:
  ```sh
  dotenv -e .env.local -- npx prisma generate
  ```
- Run the following command in the terminal to push the database schema to the database:

  ```sh
  dotenv -e .env.local -- npx prisma db push
  ```

- [Optional] Run the following command in the terminal to start the database or you can see the database on phpmyadmin:
  ```sh
  dotenv -e .env.local -- npx prisma studio
  ```

7.  Run the following command in the terminal to start the server [Default port is 3000]:

    ```sh
    yarn dev
    ```

8.  Now you can login and register to the system.
