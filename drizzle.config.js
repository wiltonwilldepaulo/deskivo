import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DB_URL) {
    throw new Error('DB_URL não definida');
}

export default defineConfig({
    dialect: 'postgresql',
    schema: './app/database/migration/*.js',
    out: "./app/database/migration",
    dbCredentials: {
        url: process.env.DB_URL,
    },
});