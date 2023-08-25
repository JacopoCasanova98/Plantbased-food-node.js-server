# Plantbased-food-server-node.js-gh


### Installation

To install and run the project locally, follow the steps below:

1. Make sure you have Node.js and MongoDB installed on your system.

2. Clone this repository to your computer:

   ```
   https://github.com/JacopoCasanova98/Plantbased-food-server-node.js-gh.git
   ```

3. Navigate to the project directory

4. Install the dependencies:

   ```
   npm install
   ```

5. Database configuration:

   - Create a MongoDB account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a new cluster and obtain the database connection string.
   - Paste the connection string into the `server.js` file in the database configuration section.

6. Start the server:

   ```
   npm start
   ```

7. The server will be running at `http://localhost:3000`.



## Connecting Node.js Project to MongoDB Database
### Prerequisites

Before you begin, make sure you have the following:

1. Node.js installed on your machine.
2. MongoDB Atlas account or a locally installed MongoDB server.

### Steps

1. Clone the repository to your local machine.

2. Navigate to the project's root directory.

3. Install the project dependencies by running the following command:

   ```
   npm install
   ```

4. Edit the `.env.example` and call it `.env`. This file will contain your environment variables.

5. Open the `.env` file and edit the following line:

   ```
   DB_CONNECTION_STRING=
   ```

   Replace the empty value after the `=` sign with your MongoDB connection string. If you're using MongoDB Atlas, you can find the connection string in the MongoDB Atlas dashboard. If you're using a locally installed MongoDB server, use the appropriate connection string.

6. Save the `.env` file.

7. Start the Node.js application by running the following command:

   ```
   npm start
   ```

   This command will start the application and establish a connection to the MongoDB database using the connection string you provided.

   You should see a message in the console indicating that the application is connected to the database.


For more information on how to interact with MongoDB using Node.js, refer to the MongoDB Node.js driver or Mongoose documentation.
