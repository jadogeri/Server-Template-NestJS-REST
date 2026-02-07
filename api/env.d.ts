import { NodeEnvironment } from "src/common/types/node-environment.type";

declare global {
    
    namespace Express {
        export interface Request {
            payload?: IJwtPayload, // Add the user property to the Request interface
            body: any,
            user?: UserPayload; // Add user property to Request interface
        }
    }

    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: NodeEnvironment;
            DATABASE_URL: string;
            BCRYPT_SALT_ROUNDS: string | number;
            BCRYPT_SECRET: string;
            JWT_ACCESS_TOKEN_SECRET: string;
            JWT_ACCESS_TOKEN_EXPIRATION_MS: string | number;
            JWT_REFRESH_TOKEN_SECRET: string;
            JWT_REFRESH_TOKEN_EXPIRATION_MS: string | number;
            JWT_VERIFY_TOKEN_SECRET: string;
            JWT_VERIFY_TOKEN_EXPIRATION_MS: string | number;
            PORT: string | number;
            ARGON2_MEMORY: string | number;
            ARGON2_ITERATIONS: string | number;
            ARGON2_PARALLELISM: string | number;
            ARGON2_SECRET: string;
        }
    }
}

export {}
