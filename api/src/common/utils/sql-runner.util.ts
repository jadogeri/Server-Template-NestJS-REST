import { QueryRunner } from "typeorm";
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Utility to execute external SQL files within a TypeORM migration
 * @param queryRunner The TypeORM query runner
 * @param relativePath Path relative to the current migration file
 */

console.log("__dirname in migration is:", __dirname);

export async function sqlRunner(queryRunner: QueryRunner, relativePath: string, table: string): Promise<void> {
    const filePath = path.join(__dirname, relativePath);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Execute the SQL. Note: If your file contains multiple 
    // statements, ensure your DB driver supports it or split by ';'
    console.log(`Executing SQL for seeding ${table}...`);
    const statements = sql.split(';').filter(s => s.trim() !== '');
    for (const statement of statements) {
        await queryRunner.query(statement);
    }
    console.log(`${table} seeded successfully.`);
}