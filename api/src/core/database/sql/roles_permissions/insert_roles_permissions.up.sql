-- Mapping Permissions to Roles
-- This script uses subqueries to fetch IDs to ensure compatibility even if serial IDs vary.

-- 1. ADMIN: Full access to everything (*)
INSERT INTO "roles_permissions" ("roleId", "permissionId")
SELECT r.id, p.id
FROM "roles" r, "permissions" p
WHERE r.name = 'admin' AND p.action = '*'
AND NOT EXISTS (
    SELECT 1 FROM "roles_permissions" rp 
    WHERE rp.roleId = r.id AND rp.permissionId = p.id
);

-- 2. EDITOR: Full access to CONTACT and PROFILE, Read-only for others
INSERT INTO "roles_permissions" ("roleId", "permissionId")
SELECT r.id, p.id
FROM "roles" r, "permissions" p
WHERE r.name = 'editor' 
AND (
    (p.resource IN ('contact', 'profile') AND p.action = '*') OR
    (p.resource IN ('user', 'role') AND p.action = 'read')
)
AND NOT EXISTS (
    SELECT 1 FROM "roles_permissions" rp 
    WHERE rp.roleId = r.id AND rp.permissionId = p.id
);

-- 3. USER: Read/Update own PROFILE and CONTACTS
INSERT INTO "roles_permissions" ("roleId", "permissionId")
SELECT r.id, p.id
FROM "roles" r, "permissions" p
WHERE r.name = 'user' 
AND (
    (p.resource IN ('profile', 'contact') AND p.action IN ('read', 'update')) OR
    (p.resource = 'auth' AND p.action = 'read')
)
AND NOT EXISTS (
    SELECT 1 FROM "roles_permissions" rp 
    WHERE rp.roleId = r.id AND rp.permissionId = p.id
);

-- 4. VIEWER: Read-only access across the board
INSERT INTO "roles_permissions" ("roleId", "permissionId")
SELECT r.id, p.id
FROM "roles" r, "permissions" p
WHERE r.name = 'viewer' AND p.action = 'read'
AND NOT EXISTS (
    SELECT 1 FROM "roles_permissions" rp 
    WHERE rp.roleId = r.id AND rp.permissionId = p.id
);

-- 5. SUPER USER: All permissions except sensitive ADMIN and PERMISSION management
INSERT INTO "roles_permissions" ("roleId", "permissionId")
SELECT r.id, p.id
FROM "roles" r, "permissions" p
WHERE r.name = 'super user' 
AND p.resource NOT IN ('admin', 'permission')
AND NOT EXISTS (
    SELECT 1 FROM "roles_permissions" rp 
    WHERE rp.roleId = r.id AND rp.permissionId = p.id
);
