import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 makes Prisma available app-wide (recommended)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
