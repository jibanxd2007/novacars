const fs = require('fs');
const path = require('path');

const target = process.argv[2];
const schemaPath = path.join(__dirname, 'schema.prisma');

if (!target || !['postgres', 'sqlite'].includes(target.toLowerCase())) {
  console.log('Usage: node prisma/switch-db.js [postgres|sqlite]');
  process.exit(1);
}

let schema = fs.readFileSync(schemaPath, 'utf8');

if (target.toLowerCase() === 'postgres') {
  schema = schema.replace(
    /datasource db \{[\s\S]*?\}/,
    `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}`
  );
  console.log('Switched Prisma datasource to PostgreSQL (uses env: DATABASE_URL)');
} else {
  schema = schema.replace(
    /datasource db \{[\s\S]*?\}/,
    `datasource db {\n  provider = "sqlite"\n  url      = "file:./dev.db"\n}`
  );
  console.log('Switched Prisma datasource to SQLite (uses file:./dev.db)');
}

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('schema.prisma updated successfully.');
