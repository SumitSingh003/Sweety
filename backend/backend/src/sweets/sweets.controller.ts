import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import type { Request } from 'express';

@Controller('sweets')
export class SweetsController {
  constructor(private readonly sweetsService: SweetsService) {}

  // ✅ PUBLIC — anyone can view sweets
  @Get()
  findAll() {
    return this.sweetsService.findAll();
  }

  @Get('search')
  search(
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.sweetsService.search(
      query,
      category,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
    );
  }

  // 🔐 ADMIN ONLY — add sweet
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() body) {
    return this.sweetsService.create(body);
  }

  // 🔐 ADMIN ONLY — update sweet
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.sweetsService.update(id, body);
  }

  // 🔐 ADMIN ONLY — delete sweet
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.sweetsService.delete(id);
  }

  // 🔐 USER — purchase sweet
  @UseGuards(JwtAuthGuard)
  @Post(':id/purchase')
  purchase(
    @Param('id') id: string,
    @Body('quantity', ParseIntPipe) quantity: number,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.userId;
    return this.sweetsService.purchase(id, quantity, userId);
  }

  // 🔐 ADMIN ONLY — restock sweet
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/restock')
  restock(
    @Param('id') id: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.sweetsService.restock(id, quantity);
  }

  // 🔐 USER — purchase history
  @UseGuards(JwtAuthGuard)
  @Get('purchases/history')
  purchaseHistory(@Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.sweetsService.findPurchases(userId);
  }
}
