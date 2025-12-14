import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SweetsService {
  constructor(private prisma: PrismaService) {}

  create(data) {
    return this.prisma.sweet.create({ data });
  }

  findAll() {
    return this.prisma.sweet.findMany();
  }

  update(id: string, data) {
    return this.prisma.sweet.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.sweet.delete({ where: { id } });
  }

  purchase(id: string, quantity: number) {
    return this.prisma.sweet.update({
      where: { id },
      data: {
        quantity: { decrement: quantity },
      },
    });
  }
}
