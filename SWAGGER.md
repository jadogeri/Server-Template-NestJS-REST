<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Endpoint Documentation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 1000px; margin: 0 auto; padding: 20px; background-color: #f4f7f9; }
        h1 { border-bottom: 2px solid #0056b3; padding-bottom: 10px; color: #0056b3; }
        .section { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .section-title { margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }        
        .endpoint { 
            display: flex; 
            align-items: center; 
            padding: 10px 0; 
            border-bottom: 1px solid #f2f2f2; 
        }
        .endpoint:last-child { border-bottom: none; }        
        .method { 
            font-weight: bold; 
            font-size: 0.75rem; 
            padding: 4px 0; 
            border-radius: 4px; 
            width: 70px; /* Fixed width for method badges */
            text-align: center; 
            margin-right: 20px; 
            color: white;
            flex-shrink: 0;
        }        
        /* Method Colors */
        .get { background-color: #61affe; }
        .post { background-color: #49cc90; }
        .put { background-color: #fca130; }
        .patch { background-color: #50e3c2; color: #111; }
        .delete { background-color: #f93e3e; }
        .path { 
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; 
            font-weight: 600; 
            color: #3b4151; 
            width: 280px; /* Fixed width ensures descriptions align vertically */
            flex-shrink: 0;
            white-space: nowrap;
        }
        .description { 
            font-size: 0.9em; 
            color: #666; 
            padding-left: 20px;
            border-left: 1px solid #eee; /* Optional: adds a visual separator */
        }
    </style>
</head>
<body>
    <h1>System API Reference</h1>
    <div class="section">
        <h2 class="section-title">1. Authentication (/auth)</h2>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/auth/login</span>
            <span class="description">Authenticates user credentials and returns a JWT/session.</span>
        </div>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/auth/register</span>
            <span class="description">Creates a new user account.</span>
        </div>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/auth/forgot-password</span>
            <span class="description">Initiates the password recovery flow.</span>
        </div>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/auth/reset-password</span>
            <span class="description">Sets a new password using a reset token.</span>
        </div>
        <div class="endpoint">
            <span class="method patch">PATCH</span>
            <span class="path">/auth/deactivate</span>
            <span class="description">Disables a registered user account.</span>
        </div>
    </div>
    <div class="section">
        <h2 class="section-title">2. Session Management (/sessions)</h2>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/sessions/:id</span>
            <span class="description">Retreives single active sessions for the current user.</span>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/sessions</span>
            <span class="description">Lists all active sessions for the current user.</span>
        </div>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/sessions/refresh</span>
            <span class="description">Exchanges a refresh token for a new access token.</span>
        </div>
        <div class="endpoint">
            <span class="method delete">DELETE</span>
            <span class="path">/sessions/:id</span>
            <span class="description">Revokes a specific session (logout from one device).</span>
        </div>
        <div class="endpoint">
            <span class="method delete">DELETE</span>
            <span class="path">/sessions</span>
            <span class="description">Revokes all active sessions for the user.</span>
        </div>
    </div>
    <div class="section">
        <h2 class="section-title">3. User Management (/users)</h2>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/users</span>
            <span class="description">Retrieves a paginated list of all users.</span>
        </div>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/users</span>
            <span class="description">Allows an admin to manually create a user.</span>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/users/:id</span>
            <span class="description">Fetches detailed account info for a specific user.</span>
        </div>
        <div class="endpoint">
            <span class="method patch">PATCH</span>
            <span class="path">/users/:id</span>
            <span class="description">Updates account status (e.g., suspending).</span>
        </div>
        <div class="endpoint">
            <span class="method delete">DELETE</span>
            <span class="path">/users/:id</span>
            <span class="description">Deletes or deactivates a user account.</span>
        </div>
    </div>
    <div class="section">
        <h2 class="section-title">4. User Profile (/profile)</h2>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/profile</span>
            <span class="description">Retrieves the current user's own data.</span>
        </div>
        <div class="endpoint">
            <span class="method put">PUT</span>
            <span class="path">/profile</span>
            <span class="description">Updates personal info (fullName, avatar).</span>
        </div>
        <div class="endpoint">
            <span class="method patch">PATCH</span>
            <span class="path">/profile/password</span>
            <span class="description">Specific endpoint for password changes.</span>
        </div>
    </div>
    <div class="section">
        <h2 class="section-title">5. Contact Information</h2>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/contacts</span>
            <span class="description">Updates phone, email, fax, or location.</span>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/contacts/:id</span>
            <span class="description">Fetches the contact entity (Phone, Email, Location).</span>
        </div>
        <div class="endpoint">
            <span class="method patch">PATCH</span>
            <span class="path">/contacts/:id</span>
            <span class="description">Updates phone, email, fax, or location.</span>
        </div>
        <div class="endpoint">
            <span class="method delete">DELETE</span>
            <span class="path">/contacts/:id</span>
            <span class="description">Delete the contact entity.</span>
        </div>
    </div>
    <div class="section">
        <h2 class="section-title">6. Roles (/roles)</h2>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/roles</span>
            <span class="description">Lists all available roles.</span>
        </div>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/roles</span>
            <span class="description">Creates a new role definition.</span>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/roles/:id/permissions</span>
            <span class="description">Lists permissions attached to a specific role.</span>
        </div>
    </div>
    <div class="section">
        <h2 class="section-title">7. Permissions (/permissions)</h2>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/permissions</span>
            <span class="description">Lists all granular permissions in the system.</span>
        </div>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/roles/:id/permissions</span>
            <span class="description">Attaches or detaches permissions from a role.</span>
        </div>
    </div>
    <div class="section">
        <h2 class="section-title">8. Administrative (/admin)</h2>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/admin/stats</span>
            <span class="description">General system health and login activity.</span>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/admin/audit-logs</span>
            <span class="description">History of sensitive actions across the system.</span>
        </div>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/admin/maintenance</span>
            <span class="description">Triggers system-wide maintenance settings.</span>
        </div>
    </div>
</body>
</html>
