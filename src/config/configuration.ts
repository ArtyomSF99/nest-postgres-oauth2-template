export const Config = () => ({
  nodeConfiguration: {
    environment: process.env.NODE_ENV || 'development',
    port: Number(process.env.NODE_PORT) || 5000,
    accessControlOrigin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN || '*',
  },
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET,
    accessTokenTime: process.env.JWT_ACCESS_TIME,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
    refreshTokenTime: process.env.JWT_REFRESH_TIME,
  },
});

export { Config as default };
