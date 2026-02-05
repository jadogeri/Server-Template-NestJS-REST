<!-- DATABASE SECTION START -->
<div align="center">
  <img src="https://raw.githubusercontent.com" width="80" alt="TypeORM Logo" />
  <h2>🗄️ Database Management Guide</h2>
  <p><i>Standard operating procedures for schema migrations and data integrity.</i></p>
</div>

<hr />
<strong><i>Note: Name is a placeholder for migration name e.g InitialMigration</i></strong>

<h3>🚀 Quick Commands Reference</h3>

<table>
  <thead>
    <tr>
      <th>Action</th>
      <th>Command</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Generate Migration</b></td>
      <td><code>npm run migration:generate -- src/migrations/Name
      </code></td>
    </tr>
    <tr>
      <td><b>Run Migrations</b></td>
      <td><code>npm run migration:run</code></td>
    </tr>
    <tr>
      <td><b>Revert Last Migration</b></td>
      <td><code>npm run migration:revert</code></td>
    </tr>
    <tr>
      <td><b>Create Empty Migration</b></td>
      <td><code>npm run migration:create -- src/migrations/Name</code></td>
    </tr>
  </tbody>
</table>

<br />

<h3>📖 Detailed Instructions</h3>

<details open>
<summary><b>1. Schema Lifecycle (Generate & Apply)</b></summary>
<p>When you modify an <code>.entity.ts</code> file, you must generate a migration to sync the database. The <code>--</code> separator is required to pass the path to the CLI.</p>

```bash
# 1. Generate the SQL file based on entity changes
# Compares your entities with the database and auto-fills 'up' and 'down' methods
npm run migration:generate -- src/migrations/UpdateUserSchema

# 2. View pending vs. applied migrations
# Shows [X] for applied migrations and [ ] for those still pending
npm run migration:show

# 3. Apply the changes to the database
# Executes all pending migrations in order by their timestamp
npm run migration:run

# 4. Roll back ONLY the most recently executed migration
# To revert multiple, run this command multiple times
npm run migration:revert

# 5. Create an empty migration file
# Used when you want to write manual SQL (e.g., seeding data or complex alters)
npm run migration:create -- src/migrations/ManualChange

# 6. Preview SQL changes (Safe Check)
# Shows the SQL that WOULD be run by schema:sync without executing it
npm run schema:log

# 7. Force-sync database (⚠️ DEV ONLY)
# Directly alters the DB to match entities without creating migration files
npm run schema:sync

# 8. Drop database schema (⚠️ DESTRUCTIVE)
# Deletes all tables and data in the current database
npm run schema:drop
