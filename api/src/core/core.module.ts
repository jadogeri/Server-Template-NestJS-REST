import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';



@Module({
  imports: [
    InfrastructureModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {}

  