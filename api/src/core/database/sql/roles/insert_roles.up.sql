-- ADMIN
INSERT INTO "roles" ("name", "description")
SELECT 'admin', 'Administrator with full system access'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'admin');

-- USER
INSERT INTO "roles" ("name", "description")
SELECT 'user', 'Standard registered user'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'user');

-- EDITOR
INSERT INTO "roles" ("name", "description")
SELECT 'editor', 'Can create and edit content but cannot manage users'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'editor');

-- VIEWER
INSERT INTO "roles" ("name", "description")
SELECT 'viewer', 'Read-only access to the system'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'viewer');

-- SUPER USER
INSERT INTO "roles" ("name", "description")
SELECT 'super user', 'Higher level user with elevated privileges'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'super user');
