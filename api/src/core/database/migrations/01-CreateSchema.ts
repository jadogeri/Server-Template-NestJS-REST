import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSchema1234567890000 implements MigrationInterface {
    name = 'CreateSchema1234567890000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_sessions" ("id" varchar PRIMARY KEY NOT NULL, "refreshTokenHash" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "authId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_sessions"("id", "refreshTokenHash", "expiresAt", "createdAt", "authId") SELECT "id", "refreshTokenHash", "expiresAt", "createdAt", "authId" FROM "sessions"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`ALTER TABLE "temporary_sessions" RENAME TO "sessions"`);
        await queryRunner.query(`DROP INDEX "IDX_4fb14631257670efa14b15a3d8"`);
        await queryRunner.query(`DROP INDEX "IDX_776b7cf9330802e5ef5a8fb18d"`);
        await queryRunner.query(`CREATE TABLE "temporary_users_roles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "FK_4fb14631257670efa14b15a3d86" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`INSERT INTO "temporary_users_roles"("userId", "roleId") SELECT "userId", "roleId" FROM "users_roles"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`ALTER TABLE "temporary_users_roles" RENAME TO "users_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_4fb14631257670efa14b15a3d8" ON "users_roles" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_776b7cf9330802e5ef5a8fb18d" ON "users_roles" ("userId") `);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bio" varchar, "avatarUrl" varchar, "website" varchar, "socialMediaHandle" varchar, "gender" varchar, "preferences" text, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "locationAddress" varchar, "locationCity" varchar, "locationState" varchar, "locationZipcode" varchar, CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "auths" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(150) NOT NULL, "password" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "isVerified" boolean NOT NULL DEFAULT (0), "lastLoginAt" datetime, "userId" integer, CONSTRAINT "UQ_a28e912dc6bde5945582f2be0a2" UNIQUE ("email"), CONSTRAINT "REL_3e65bf4e56bde80b7b5e5b9e13" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(100) NOT NULL, "lastName" varchar(100) NOT NULL, "dateOfBirth" date)`);
        await queryRunner.query(`CREATE TABLE "contacts" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fullName" varchar NOT NULL, "phone" varchar, "email" varchar, "fax" varchar, "locationAddress" varchar, "locationCity" varchar, "locationState" varchar, "locationZipcode" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bio" varchar, "avatarUrl" varchar, "website" varchar, "socialMediaHandle" varchar, "gender" varchar, "preferences" text, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "locationAddress" varchar, "locationCity" varchar, "locationState" varchar, "locationZipcode" varchar, CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"), CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_profiles"("id", "bio", "avatarUrl", "website", "socialMediaHandle", "gender", "preferences", "updatedAt", "userId", "locationAddress", "locationCity", "locationState", "locationZipcode") SELECT "id", "bio", "avatarUrl", "website", "socialMediaHandle", "gender", "preferences", "updatedAt", "userId", "locationAddress", "locationCity", "locationState", "locationZipcode" FROM "profiles"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`ALTER TABLE "temporary_profiles" RENAME TO "profiles"`);
        await queryRunner.query(`CREATE TABLE "temporary_sessions" ("id" varchar PRIMARY KEY NOT NULL, "refreshTokenHash" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "authId" integer, CONSTRAINT "FK_9d9b039cb147f4917ea78bd748a" FOREIGN KEY ("authId") REFERENCES "auths" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sessions"("id", "refreshTokenHash", "expiresAt", "createdAt", "authId") SELECT "id", "refreshTokenHash", "expiresAt", "createdAt", "authId" FROM "sessions"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`ALTER TABLE "temporary_sessions" RENAME TO "sessions"`);
        await queryRunner.query(`CREATE TABLE "temporary_auths" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(150) NOT NULL, "password" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "isVerified" boolean NOT NULL DEFAULT (0), "lastLoginAt" datetime, "userId" integer, CONSTRAINT "UQ_a28e912dc6bde5945582f2be0a2" UNIQUE ("email"), CONSTRAINT "REL_3e65bf4e56bde80b7b5e5b9e13" UNIQUE ("userId"), CONSTRAINT "FK_3e65bf4e56bde80b7b5e5b9e133" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_auths"("createdAt", "updatedAt", "id", "email", "password", "isEnabled", "isVerified", "lastLoginAt", "userId") SELECT "createdAt", "updatedAt", "id", "email", "password", "isEnabled", "isVerified", "lastLoginAt", "userId" FROM "auths"`);
        await queryRunner.query(`DROP TABLE "auths"`);
        await queryRunner.query(`ALTER TABLE "temporary_auths" RENAME TO "auths"`);
        await queryRunner.query(`DROP INDEX "IDX_4fb14631257670efa14b15a3d8"`);
        await queryRunner.query(`DROP INDEX "IDX_776b7cf9330802e5ef5a8fb18d"`);
        await queryRunner.query(`CREATE TABLE "temporary_users_roles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "FK_4fb14631257670efa14b15a3d86" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_776b7cf9330802e5ef5a8fb18dc" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`INSERT INTO "temporary_users_roles"("userId", "roleId") SELECT "userId", "roleId" FROM "users_roles"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`ALTER TABLE "temporary_users_roles" RENAME TO "users_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_4fb14631257670efa14b15a3d8" ON "users_roles" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_776b7cf9330802e5ef5a8fb18d" ON "users_roles" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_776b7cf9330802e5ef5a8fb18d"`);
        await queryRunner.query(`DROP INDEX "IDX_4fb14631257670efa14b15a3d8"`);
        await queryRunner.query(`ALTER TABLE "users_roles" RENAME TO "temporary_users_roles"`);
        await queryRunner.query(`CREATE TABLE "users_roles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "FK_4fb14631257670efa14b15a3d86" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`INSERT INTO "users_roles"("userId", "roleId") SELECT "userId", "roleId" FROM "temporary_users_roles"`);
        await queryRunner.query(`DROP TABLE "temporary_users_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_776b7cf9330802e5ef5a8fb18d" ON "users_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4fb14631257670efa14b15a3d8" ON "users_roles" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "auths" RENAME TO "temporary_auths"`);
        await queryRunner.query(`CREATE TABLE "auths" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(150) NOT NULL, "password" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "isVerified" boolean NOT NULL DEFAULT (0), "lastLoginAt" datetime, "userId" integer, CONSTRAINT "UQ_a28e912dc6bde5945582f2be0a2" UNIQUE ("email"), CONSTRAINT "REL_3e65bf4e56bde80b7b5e5b9e13" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "auths"("createdAt", "updatedAt", "id", "email", "password", "isEnabled", "isVerified", "lastLoginAt", "userId") SELECT "createdAt", "updatedAt", "id", "email", "password", "isEnabled", "isVerified", "lastLoginAt", "userId" FROM "temporary_auths"`);
        await queryRunner.query(`DROP TABLE "temporary_auths"`);
        await queryRunner.query(`ALTER TABLE "sessions" RENAME TO "temporary_sessions"`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" varchar PRIMARY KEY NOT NULL, "refreshTokenHash" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "authId" integer)`);
        await queryRunner.query(`INSERT INTO "sessions"("id", "refreshTokenHash", "expiresAt", "createdAt", "authId") SELECT "id", "refreshTokenHash", "expiresAt", "createdAt", "authId" FROM "temporary_sessions"`);
        await queryRunner.query(`DROP TABLE "temporary_sessions"`);
        await queryRunner.query(`ALTER TABLE "profiles" RENAME TO "temporary_profiles"`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bio" varchar, "avatarUrl" varchar, "website" varchar, "socialMediaHandle" varchar, "gender" varchar, "preferences" text, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "locationAddress" varchar, "locationCity" varchar, "locationState" varchar, "locationZipcode" varchar, CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "profiles"("id", "bio", "avatarUrl", "website", "socialMediaHandle", "gender", "preferences", "updatedAt", "userId", "locationAddress", "locationCity", "locationState", "locationZipcode") SELECT "id", "bio", "avatarUrl", "website", "socialMediaHandle", "gender", "preferences", "updatedAt", "userId", "locationAddress", "locationCity", "locationState", "locationZipcode" FROM "temporary_profiles"`);
        await queryRunner.query(`DROP TABLE "temporary_profiles"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "auths"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP INDEX "IDX_776b7cf9330802e5ef5a8fb18d"`);
        await queryRunner.query(`DROP INDEX "IDX_4fb14631257670efa14b15a3d8"`);
        await queryRunner.query(`ALTER TABLE "users_roles" RENAME TO "temporary_users_roles"`);
        await queryRunner.query(`CREATE TABLE "users_roles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "FK_4fb14631257670efa14b15a3d86" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_776b7cf9330802e5ef5a8fb18dc" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`INSERT INTO "users_roles"("userId", "roleId") SELECT "userId", "roleId" FROM "temporary_users_roles"`);
        await queryRunner.query(`DROP TABLE "temporary_users_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_776b7cf9330802e5ef5a8fb18d" ON "users_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4fb14631257670efa14b15a3d8" ON "users_roles" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "sessions" RENAME TO "temporary_sessions"`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" varchar PRIMARY KEY NOT NULL, "refreshTokenHash" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "authId" integer, CONSTRAINT "FK_9d9b039cb147f4917ea78bd748a" FOREIGN KEY ("authId") REFERENCES "auth" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "sessions"("id", "refreshTokenHash", "expiresAt", "createdAt", "authId") SELECT "id", "refreshTokenHash", "expiresAt", "createdAt", "authId" FROM "temporary_sessions"`);
        await queryRunner.query(`DROP TABLE "temporary_sessions"`);
    }

}
