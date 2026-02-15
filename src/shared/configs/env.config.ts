import "dotenv/config";

const nodeEnv = process.env.NODE_ENV || "dev";
const port = process.env.PORT || 3201;

const devDbUrl = process.env.DEV_DB_URL;
const prodDbUrl = process.env.PROD_DB_URL;

const devClientUrl = process.env.DEV_CLIENT_URL;
const prodClientUrl = process.env.PROD_CLIENT_URL;

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const imgHostingApiKey = process.env.IMG_HOSTING_API_KEY;

export const envConfig = {
  nodeEnv,
  port,
  dbUrl: nodeEnv === "dev" ? devDbUrl : prodDbUrl,
  clientUrl: nodeEnv === "dev" ? devClientUrl : prodClientUrl,
  refreshTokenSecret,
  accessTokenSecret,
  imgHostingApiKey,
};
