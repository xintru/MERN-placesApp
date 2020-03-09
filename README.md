### Starting up an application

In order to start the application you have to follow these steps:


## App won't work without secrets.

- You have to create a folder on a root level labeled secrets and place a secrets.js file there. I don't feel like sharing my own api keys or MongoDB cluster.
- Then you have to put a **GOOGLE_MAPS_API_KEY** variable in secrets.js which, as you might've guessed, should be your google maps api key. 
- Also you need to put a **MONGODB_PATH** variable there which should be your MongoDB credentials.
- Finally, you have to create a **JWT_PRIVATE_KEY** variable which should be a basic string.
- Export all three with exports.*** syntax.

## What next? 
 
- Just run `npm install` on root level and in client folder.
- To start Frontend server you can run `npm start` inside client folder and to start backend server you can run `npm start` on app's root level. But there is a way to start them both in a single console window: just run `npm run dev` on app's root level.