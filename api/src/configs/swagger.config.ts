
import { DocumentBuilder } from '@nestjs/swagger';

  export const swaggerConfig = new DocumentBuilder()
    .setTitle('User Auth App')
    .setDescription('The API description')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setContact('User API', 'https://your-website.com', 'your-email@example.com')
    .setTermsOfService('https://your-website.com/terms')
    .setExternalDoc('Find out more', 'https://your-website.com/docs')
    .addServer('http://localhost:3000', "Local development server")
    .addServer('https://your-website.com', "Production server")
    .addServer('https://staging.your-website.com', "Staging server")
    .addServer('http://localhost:3001', "Testing server")
    .addTag('User', 'Operations related to users')
    .addTag('Auth', 'Operations related to authentication')
    .addTag('Profile', 'Operations related to user profiles')
    .addTag('Contact', 'Operations related to contacts')
    // .addTag('Admin', 'Administrative operations')
    .addTag('Session', 'Operations related to user sessions')
    .addTag('Permission', 'Operations related to permissions')
    .addTag('Role', 'Operations related to roles')
    // Add bearer authentication if your API uses JWTs
    .addBearerAuth()
    .build();



  export const adminSwaggerConfig = new DocumentBuilder()
    .setTitle('Admin API App')
    .setDescription('The ADMIN API description')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setContact('Admin API', 'https://your-website.com', 'your-email@example.com')
    .setTermsOfService('https://your-website.com/terms')
    .setExternalDoc('Find out more', 'https://your-website.com/docs')
    .addServer('http://localhost:3000', "Local development server")
    .addServer('https://your-website.com', "Production server")
    .addServer('https://staging.your-website.com', "Staging server")
    .addServer('http://localhost:3001', "Testing server")
    .addTag('Admin', 'Administrative operations') 
    // Add bearer authentication if your API uses JWTs
    .addBearerAuth()
    .build();