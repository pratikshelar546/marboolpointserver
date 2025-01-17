import { Client } from "pg";

export const client = new Client(
  {
    user: 'postgres',
    host: 'marboolpoint.cxkqeay6cxaq.us-east-1.rds.amazonaws.com',
    database: 'marboolpoint',
    password: 'Marboolpoint#12',
    port: 5432,
    ssl: {
      rejectUnauthorized: false, // Disable SSL certificate validation (for testing purposes)
    },
  }
);


