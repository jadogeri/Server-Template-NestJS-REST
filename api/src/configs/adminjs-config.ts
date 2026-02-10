import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Role } from '../modules/role/entities/role.entity';

AdminJS.registerAdapter({ Database, Resource });

export const adminJsConfig = {
  adminJsOptions: {
    rootPath: '/admin',
    resources: [
      User, 
      Role,
    ],
  },
  auth: {
    authenticate: async (email, password) => {
      if (email === 'admin@example.com' && password === 'password') {
        return { email: 'admin@example.com' };
      }
      return null;
    },
    cookieName: 'adminjs-session',
    cookiePassword: 'complex-password-at-least-32-characters',
  },
};
