import { Module } from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { SweetsController } from './sweets.controller';

@Module({
  providers: [SweetsService],
  controllers: [SweetsController]
})
export class SweetsModule {}
