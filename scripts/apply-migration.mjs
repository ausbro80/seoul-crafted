#!/usr/bin/env node
/**
 * Apply a single .sql file from supabase/migrations against the project's
 * Supabase Postgres. Uses POSTGRES_URL_NON_POOLING so DDL works reliably
 * (pooled connections can break on certain DDL).
 *
 * Usage:  node scripts/apply-migration.mjs 0004_chat_translations.sql
 */
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

// Load .env.local so the script can be run from the repo without extra setup.
function loadEnv(filename) {
  const envPath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (val && !(key in process.env)) process.env[key] = val;
  }
}

// Prefer .env.migrations (plain, user-provided) over .env.local (Vercel-pulled,
// which encrypts sensitive integration values and leaves POSTGRES_URL blank).
loadEnv(".env.migrations");
loadEnv(".env.local");

const fileArg = process.argv[2];
if (!fileArg) {
  console.error("Usage: apply-migration.mjs <file.sql>");
  process.exit(1);
}

const sqlPath = path.resolve(
  process.cwd(),
  "supabase",
  "migrations",
  fileArg,
);
if (!fs.existsSync(sqlPath)) {
  console.error(`Not found: ${sqlPath}`);
  process.exit(1);
}

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL;
if (!connectionString) {
  console.error(
    [
      "POSTGRES_URL missing.",
      "Vercel stores it as an encrypted integration var — `vercel env pull` receives an empty value.",
      "",
      "Fix (one-time): create .env.migrations in the repo root with:",
      '  POSTGRES_URL_NON_POOLING="postgresql://postgres:PASSWORD@db.bbduwkpebzabirifhuyt.supabase.co:5432/postgres"',
      "",
      "Get the direct-connection string from Supabase dashboard →",
      "  Project settings → Database → Connection string → Direct",
    ].join("\n"),
  );
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, "utf8");

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log(`Applying ${fileArg}…`);
  await client.query(sql);
  console.log("OK");
} catch (err) {
  console.error("Failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
