import { Client } from "pg";

export const client = new Client(
  "postgres://postgres:root@localhost:5432/marboolpoint"
);
