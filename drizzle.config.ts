import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/modules/Database/schemas/*',
  out: './src/modules/Database/drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
