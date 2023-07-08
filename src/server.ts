import Express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const { WATCHED_CHANNEL, STATE, REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

if (!WATCHED_CHANNEL) throw new Error('WATCHED_CHANNEL required');
if (!STATE) throw new Error('STATE required');
if (!REDIRECT_URL) throw new Error('REDIRECT_URL required');
if (!CLIENT_ID) throw new Error('CLIENT_ID required');
if (!CLIENT_SECRET) throw new Error('CLIENT_SECRET required');

const port = process.env.PORT || 4141;

const authBaseURL = `https://id.twitch.tv/oauth2`;

const app = Express();

import { initBot } from './chatbot/bot';

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.get('/authenticate', async (req, res) => {
  const parameters = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URL,
    response_type: 'code',
    state: STATE,
    scope: encodeURI('chat:edit chat:read').replace('%20', ' '),
  });

  const url = `${authBaseURL}/authorize?${parameters}`;

  res.redirect(url);
});

app.get('/callback', async (req, res) => {
  const code = (req?.query?.code as string) || '';

  const qs = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URL,
  });

  try {
    const url = `${authBaseURL}/token?${qs}`;
    const getAuthorization = async url => {
      const response = await fetch(url, { method: 'POST' });
      return response.json();
    };
    getAuthorization(url).then(data => {
      initBot({ code: data.access_token, channel: WATCHED_CHANNEL });
      console.log("Successfully obtained new oAuth token.")
      process.env.TWITCH_ACCESS_CODE = data.access_token;
      res.sendFile(path.join(__dirname + '/html/success.html'));
    });
  } catch (error) {
    res.json({
      message: error.message,
      body: error.response.data,
    });
  }
});

app.get('/test', async (req, res) => {
  res.send('testing');
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
