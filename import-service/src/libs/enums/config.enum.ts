export const ConfigEnum = {
  BUCKET_NAME: process.env.BUCKET_NAME,
  REGION: process.env.REGION,
  PATH: process.env.PATH,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
} as const;
