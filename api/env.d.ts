import { NodeEnvironment } from "src/common/types/node-environment.type";
import { JwtPayloadInterface } from "./src/common/interfaces/jwt-payload.interface";
import { UserPayload } from "./src/common/interfaces/user-payload.interface";

declare global {
    
    namespace Express {
        export interface Request {
            jwt?: JwtPayloadInterface; // Add the user property to the Request interface
            body: any; // You can specify a more specific type if you have one
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
