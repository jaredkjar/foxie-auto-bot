import Express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const { WATCHED_CHANNEL, STATE, REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

if (!WATCHED_CHANNEL) throw new Error('WATCHED_CHANNEL required');

const port = process.env.PORT || 4141;

const authBaseURL = `https://id.twitch.tv/oauth2`;

const app = Express();

import { initBot } from './chatbot/bot';

app.get('/', async (req, res) => {
  const parameters = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URL,
    response_type: 'code',
    state: STATE,
    scope: encodeURI('chat:edit chat:read').replace('%20',' '),
  });

  const url = `${authBaseURL}/authorize?${parameters}`;

  res.redirect(url);
});

app.get('/callback', async (req, res) => {
  const code = req?.query?.code as string || '';

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
      res.json({success: true});
    });
  } catch (error) {
    res.json({
      message: error.message,
      body: error.response.data,
    });
  }
});

app.get('/home', async (req, res) => {
  // const code = req?.query?.code as string || '';
  // initBot({ code: code, channel: WATCHED_CHANNEL });
});

app.get('/test', async (req, res) => {
  res.send('testing')
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
