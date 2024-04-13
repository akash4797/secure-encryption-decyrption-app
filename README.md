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
Userinfo should be encrypted (while storing) and decrypted (while viewing).

Feature 3:
Password should be hashed and salted before storing in the database. -> hashPassword function is defined in utils/auth.ts

Feature 4:
Separate function for credential check. -> comparePasswords function is defined in utils/auth.ts

Feature 5:
A key management module should be defined. -> generateJWT function is defined in utils/auth.ts

Feature 6:
Users can post/view using encryption and decryption.

Feature 7:
Every major piece of information in the database should be encrypted. Le. if an attacker has access to the database, unable to retrieve any data. -> Check Database Encryption.

### Application Installation Steps

1. Install dependencies using Yarn:
   ```sh
   yarn install
   ```
2. Set up MySQL database using XAMPP and phpMyAdmin:

- Create a database using the following command in the MySQL console:
  ```sql
  CREATE DATABASE secureauth;
  ```
- Get the username and password from phpMyAdmin and create an URL to connect to the database. For example:
  ```sql
  mysql://username:password@localhost/secureauth
  ```
- Create a .env.local file with the following contents or follow .env.example file:

  ```sh
  DATABASE_URL=mysql://username:password@localhost/secureauth
  JWT_SECRET="secret"
  ```

- Run the following command in the terminal to generate the Prisma client:
  ```sh
  npx prisma generate
  ```
- Run the following command in the terminal to push the database schema to the database:
  ```sh
  npx prisma db push
  ```

3.  Run the following command in the terminal to start the server:
    ```sh
    yarn dev
    ```
