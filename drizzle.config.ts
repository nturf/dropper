import * as dotenv from "dotenv"
import { defineConfig } from 'drizzle-kit';

//setup custom path for .env
//dotenv.config({path: ".env.local"})



export default defineConfig({
    out: './drizzle',
    schema: './lib/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    migrations: {
        table: "__drizzle_migration",
        schema: "public",
    },
    verbose: true,
    strict: true,
});

