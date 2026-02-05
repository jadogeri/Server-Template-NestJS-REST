import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSchema1770003784410 implements MigrationInterface {
    name = 'CreateSchema1000003784410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resource" varchar CHECK( "resource" IN ('user','profile','contact','role','permission','admin','auth','*') ) NOT NULL DEFAULT ('auth'), "action" varchar CHECK( "action" IN ('create','read','update','delete','*') ) NOT NULL DEFAULT ('read'), "description" varchar, CONSTRAINT "UQ_7331684c0c5b063803a425001a0" UNIQUE ("resource", "action"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("profile_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bio" varchar, "avatar_url" varchar, "preferences" text, "user_id" integer, "locationAddress" varchar, "locationCity" varchar, "locationState" varchar, "locationZipcode" varchar, CONSTRAINT "REL_d752442f45f258a8bdefeebb2f" UNIQUE ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" varchar PRIMARY KEY NOT NULL, "refreshTokenHash" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "authId" integer)`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(150) NOT NULL, "password" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "lastLoginAt" datetime, "user_id" integer, CONSTRAINT "UQ_b54f616411ef3824f6a5c06ea46" UNIQUE ("email"), CONSTRAINT "REL_9922406dc7d70e20423aeffadf" UNIQUE ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(100) NOT NULL, "lastName" varchar(100) NOT NULL, "age" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar CHECK( "name" IN ('admin','user','editor','viewer','super user') ) NOT NULL, "description" varchar, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "users_roles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_776b7cf9330802e5ef5a8fb18d" ON "users_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4fb14631257670efa14b15a3d8" ON "users_roles" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "roles_permissions" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_28bf280551eb9aa82daf1e156d" ON "roles_permissions" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_31cf5c31d0096f706e3ba3b1e8" ON "roles_permissions" ("permissionId") `);
        await queryRunner.query(`CREATE TABLE "temporary_profile" ("profile_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bio" varchar, "avatar_url" varchar, "preferences" text, "user_id" integer, "locationAddress" varchar, "locationCity" varchar, "locationState" varchar, "locationZipcode" varchar, CONSTRAINT "REL_d752442f45f258a8bdefeebb2f" UNIQUE ("user_id"), CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_profile"("profile_id", "bio", "avatar_url", "preferences", "user_id", "locationAddress", "locationCity", "locationState", "locationZipcode") SELECT "profile_id", "bio", "avatar_url", "preferences", "user_id", "locationAddress", "locationCity", "locationState", "locationZipcode" FROM "profile"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`ALTER TABLE "temporary_profile" RENAME TO "profile"`);
        await queryRunner.query(`CREATE TABLE "temporary_sessions" ("id" varchar PRIMARY KEY NOT NULL, "refreshTokenHash" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "authId" integer, CONSTRAINT "FK_9d9b039cb147f4917ea78bd748a" FOREIGN KEY ("authId") REFERENCES "auth" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sessions"("id", "refreshTokenHash", "expiresAt", "createdAt", "authId") SELECT "id", "refreshTokenHash", "expiresAt", "createdAt", "authId" FROM "sessions"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`ALTER TABLE "temporary_sessions" RENAME TO "sessions"`);
        await queryRunner.query(`CREATE TABLE "temporary_auth" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(150) NOT NULL, "password" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "lastLoginAt" datetime, "user_id" integer, CONSTRAINT "UQ_b54f616411ef3824f6a5c06ea46" UNIQUE ("email"), CONSTRAINT "REL_9922406dc7d70e20423aeffadf" UNIQUE ("user_id"), CONSTRAINT "FK_9922406dc7d70e20423aeffadf3" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_auth"("id", "email", "password", "isEnabled", "lastLoginAt", "user_id") SELECT "id", "email", "password", "isEnabled", "lastLoginAt", "user_id" FROM "auth"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`ALTER TABLE "temporary_auth" RENAME TO "auth"`);
        await queryRunner.query(`DROP INDEX "IDX_776b7cf9330802e5ef5a8fb18d"`);
        await queryRunner.query(`DROP INDEX "IDX_4fb14631257670efa14b15a3d8"`);
        await queryRunner.query(`CREATE TABLE "temporary_users_roles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "FK_776b7cf9330802e5ef5a8fb18dc" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4fb14631257670efa14b15a3d86" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`INSERT INTO "temporary_users_roles"("userId", "roleId") SELECT "userId", "roleId" FROM "users_roles"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`ALTER TABLE "temporary_users_roles" RENAME TO "users_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_776b7cf9330802e5ef5a8fb18d" ON "users_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4fb14631257670efa14b15a3d8" ON "users_roles" ("roleId") `);
        await queryRunner.query(`DROP INDEX "IDX_28bf280551eb9aa82daf1e156d"`);
        await queryRunner.query(`DROP INDEX "IDX_31cf5c31d0096f706e3ba3b1e8"`);
        await queryRunner.query(`CREATE TABLE "temporary_roles_permissions" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "FK_28bf280551eb9aa82daf1e156d9" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_31cf5c31d0096f706e3ba3b1e82" FOREIGN KEY ("permissionId") REFERENCES "permissions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`INSERT INTO "temporary_roles_permissions"("roleId", "permissionId") SELECT "roleId", "permissionId" FROM "roles_permissions"`);
        await queryRunner.query(`DROP TABLE "roles_permissions"`);
        await queryRunner.query(`ALTER TABLE "temporary_roles_permissions" RENAME TO "roles_permissions"`);
        await queryRunner.query(`CREATE INDEX "IDX_28bf280551eb9aa82daf1e156d" ON "roles_permissions" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_31cf5c31d0096f706e3ba3b1e8" ON "roles_permissions" ("permissionId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_31cf5c31d0096f706e3ba3b1e8"`);
        await queryRunner.query(`DROP INDEX "IDX_28bf280551eb9aa82daf1e156d"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" RENAME TO "temporary_roles_permissions"`);
        await queryRunner.query(`CREATE TABLE "roles_permissions" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`INSERT INTO "roles_permissions"("roleId", "permissionId") SELECT "roleId", "permissionId" FROM "temporary_roles_permissions"`);
        await queryRunner.query(`DROP TABLE "temporary_roles_permissions"`);
        await queryRunner.query(`CREATE INDEX "IDX_31cf5c31d0096f706e3ba3b1e8" ON "roles_permissions" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_28bf280551eb9aa82daf1e156d" ON "roles_permissions" ("roleId") `);
        await queryRunner.query(`DROP INDEX "IDX_4fb14631257670efa14b15a3d8"`);
        await queryRunner.query(`DROP INDEX "IDX_776b7cf9330802e5ef5a8fb18d"`);
        await queryRunner.query(`ALTER TABLE "users_roles" RENAME TO "temporary_users_roles"`);
        await queryRunner.query(`CREATE TABLE "users_roles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`INSERT INTO "users_roles"("userId", "roleId") SELECT "userId", "roleId" FROM "temporary_users_roles"`);
        await queryRunner.query(`DROP TABLE "temporary_users_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_4fb14631257670efa14b15a3d8" ON "users_roles" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_776b7cf9330802e5ef5a8fb18d" ON "users_roles" ("userId") `);
        await queryRunner.query(`ALTER TABLE "auth" RENAME TO "temporary_auth"`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(150) NOT NULL, "password" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "lastLoginAt" datetime, "user_id" integer, CONSTRAINT "UQ_b54f616411ef3824f6a5c06ea46" UNIQUE ("email"), CONSTRAINT "REL_9922406dc7d70e20423aeffadf" UNIQUE ("user_id"))`);
        await queryRunner.query(`INSERT INTO "auth"("id", "email", "password", "isEnabled", "lastLoginAt", "user_id") SELECT "id", "email", "password", "isEnabled", "lastLoginAt", "user_id" FROM "temporary_auth"`);
        await queryRunner.query(`DROP TABLE "temporary_auth"`);
        await queryRunner.query(`ALTER TABLE "sessions" RENAME TO "temporary_sessions"`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" varchar PRIMARY KEY NOT NULL, "refreshTokenHash" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "authId" integer)`);
        await queryRunner.query(`INSERT INTO "sessions"("id", "refreshTokenHash", "expiresAt", "createdAt", "authId") SELECT "id", "refreshTokenHash", "expiresAt", "createdAt", "authId" FROM "temporary_sessions"`);
        await queryRunner.query(`DROP TABLE "temporary_sessions"`);
        await queryRunner.query(`ALTER TABLE "profile" RENAME TO "temporary_profile"`);
        await queryRunner.query(`CREATE TABLE "profile" ("profile_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bio" varchar, "avatar_url" varchar, "preferences" text, "user_id" integer, "locationAddress" varchar, "locationCity" varchar, "locationState" varchar, "locationZipcode" varchar, CONSTRAINT "REL_d752442f45f258a8bdefeebb2f" UNIQUE ("user_id"))`);
        await queryRunner.query(`INSERT INTO "profile"("profile_id", "bio", "avatar_url", "preferences", "user_id", "locationAddress", "locationCity", "locationState", "locationZipcode") SELECT "profile_id", "bio", "avatar_url", "preferences", "user_id", "locationAddress", "locationCity", "locationState", "locationZipcode" FROM "temporary_profile"`);
        await queryRunner.query(`DROP TABLE "temporary_profile"`);
        await queryRunner.query(`DROP INDEX "IDX_31cf5c31d0096f706e3ba3b1e8"`);
        await queryRunner.query(`DROP INDEX "IDX_28bf280551eb9aa82daf1e156d"`);
        await queryRunner.query(`DROP TABLE "roles_permissions"`);
        await queryRunner.query(`DROP INDEX "IDX_4fb14631257670efa14b15a3d8"`);
        await queryRunner.query(`DROP INDEX "IDX_776b7cf9330802e5ef5a8fb18d"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
