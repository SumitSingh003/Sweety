import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { SweetsService } from './sweets.service';

@Controller('sweets')
export class SweetsController {
  constructor(private readonly sweetsService: SweetsService) {}

  @Post()
  create(@Body() body) {
    return this.sweetsService.create(body);
  }

  @Get()
  findAll() {
    return this.sweetsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.sweetsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.sweetsService.delete(id);
  }

  @Post(':id/purchase')
  purchase(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.sweetsService.purchase(id, quantity);
  }
}
