import { Module, Global } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';


@Global() // Optional: Makes Core services available everywhere
@Module({
  imports: [
    InfrastructureModule,
    SecurityModule,
  ],
  exports: [
    InfrastructureModule,
    SecurityModule,
  ], // Export services for use in other modules
  controllers: [],
  providers: [],
})
export class CoreModule {}

  