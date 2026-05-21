export interface AppEnv {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  S3_ENDPOINT: string;
  S3_PUBLIC_URL: string;
  S3_REGION: string;
  S3_BUCKET: string;
  S3_ACCESS_KEY_ID: string;
  S3_SECRET_ACCESS_KEY: string;
  S3_FORCE_PATH_STYLE: boolean;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGINS: string;
}

export function loadConfig(): AppEnv {
  return {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: Number.parseInt(process.env.PORT ?? '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    S3_ENDPOINT: process.env.S3_ENDPOINT ?? '',
    S3_PUBLIC_URL: process.env.S3_PUBLIC_URL ?? '',
    S3_REGION: process.env.S3_REGION ?? 'us-east-1',
    S3_BUCKET: process.env.S3_BUCKET ?? '',
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID ?? '',
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY ?? '',
    S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE !== 'false',
    JWT_SECRET: process.env.JWT_SECRET ?? '',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1d',
    CORS_ORIGINS: process.env.CORS_ORIGINS ?? 'http://localhost:3001',
  };
}
