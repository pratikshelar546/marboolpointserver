import { Client } from "pg";

export const client = new Client(
  "postgres://postgres:pratik@localhost:5432/marboolpoint"
);
