import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();
const db_string = process.env.POSTGRES_CONNECTION_STRING;

const pool = new Pool({
  connectionString: `postgresql://neondb_owner:${db_string}@ep-fancy-mode-a6h26yu7-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require`,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
