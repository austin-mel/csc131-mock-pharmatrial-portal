import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../environment/.back-end.env") });

if (!process.env.BACK_END_HOST) {
  throw new Error("BACK_END_HOST is missing in environment file!");
}

export const sql = neon(process.env.BACK_END_HOST);