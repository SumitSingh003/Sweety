import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SweetsModule } from './sweets/sweets.module';

@Module({
  imports: [
    PrismaModule, // 👈 REQUIRED
    AuthModule,
    SweetsModule,
  ],
})
export class AppModule {}
