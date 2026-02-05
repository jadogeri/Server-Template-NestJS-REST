import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from "node:fs";
import * as path from "node:path";
import { sqlRunner } from "../../../common/utils/sql-runner.util";

export class LoadDatabase1234567890001 implements MigrationInterface {
    name = 'LoadDatabase1234567890001'
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Path to your 'UP' script in the dist folder
        console.log("__dirname in migration is:", __dirname);
        

        await sqlRunner(queryRunner, '../../core/database/sql/permissions/insert_permissions.up.sql', 'permissions');
        await sqlRunner(queryRunner, '../../core/database/sql/roles/insert_roles.up.sql', 'roles');
        await sqlRunner(queryRunner, '../../core/database/sql/roles_permissions/insert_roles_permissions.up.sql', 'roles_permissions');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Path to your 'DOWN' script in the dist folder
        const sql = fs.readFileSync(
            path.join(__dirname, '../sql/roles/drop-roles.down.sql'), 
            'utf8'
        );
        await queryRunner.query(sql);
    }
}
