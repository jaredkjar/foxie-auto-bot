# Foxie Auto Bot built using NodeJS, Express, Typescript and TMI.JS!

- [Development](#development)
- [Deployment](#deployment)
- [Authentication](#authentication)


## Development

Setup a .env file: 

    required: 
    WATCHED_CHANNEL="" // the twitch channel name chat will be read from
    CLIENT_ID="" // client id for registered twitch bot
    REDIRECT_URL="http://localhost:4141/callback"
    STATE="" // can be anything, this is to manage cross reference
    CLIENT_SECRET="" // client secret for registered twitch bot
    TWITCH_ACCESS_CODE="" // this can be blank
    
    
Use the right version of Node with [NVM](https://github.com/nvm-sh/nvm): (anything above node v14)

    nvm use

Install the dependencies:

    npm install

Run the dev server:

    npm run dev


## Deployment

Build and run the production server:

    npm start

## Authentication

You need to access the root (localhost:4141 for local development) to login and obtain a token

    http://localhost:4141/