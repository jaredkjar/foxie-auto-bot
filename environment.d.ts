declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        WATCHED_CHANNEL: string;
        CLIENT_ID: string;
        CLIENT_SECRET: string;
        REDIRECT_URL: string;
        STATE: string;
        TWITCH_ACCESS_CODE?: string;
      }
    }
  }
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}