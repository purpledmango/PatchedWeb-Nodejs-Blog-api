### NODEJS BLOG MANAGER API

This software was built using Express (with Node.js) and Mongoose as the MongoDB driver. The API allows you to perform CRUD operations on Authors, Articles, and Tags. It also allows you to manage users based on their roles and add thumbnails to articles.

### HOW TO RUN

1. Navigate to the project directory:

```bash
cd PatchedWeb-Nodejs-Blog-api/
```
2. Create a new .env file:
 ```bash
touch .env
```
3. Open the .env file and add the following environment variables:
 ```bash
DB_URI= //ADD YOUR MONGODB DB URI HERE //
PORT= /// YOUR PORT NO //
JWT_SECRET= //your_secret_key //
DEV_ORIGIN_HOST=http://localhost:9000
ADMIN_CLIENT_HOST=//domain name //
APP_CLIENT_HOST= // domain name //  


```
4. Install dependencies:
 ```bash
npm install
```
5.Run the server:

 ```bash
npm run dev
```
