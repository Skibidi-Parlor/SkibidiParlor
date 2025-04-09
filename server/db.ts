import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: `postgresql://neondb_owner:${process.env.POSTGRES}@ep-rapid-recipe-a68isbdh-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require`,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
