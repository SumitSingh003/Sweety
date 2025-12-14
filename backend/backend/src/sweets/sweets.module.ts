import { Module } from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { SweetsController } from './sweets.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SweetsController],
  providers: [SweetsService, PrismaService],
})
export class SweetsModule {}
