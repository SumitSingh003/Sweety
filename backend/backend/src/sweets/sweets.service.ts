import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface SweetPayload {
  name: string;
  category: string;
  description?: string | null;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

@Injectable()
export class SweetsService {
  constructor(private prisma: PrismaService) {}

  create(data: SweetPayload) {
    return this.prisma.sweet.create({
      data: {
        ...data,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
      },
    });
  }

  findAll() {
    return this.prisma.sweet.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  search(query?: string, category?: string, minPrice?: number, maxPrice?: number) {
    const where: any = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    return this.prisma.sweet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Partial<SweetPayload>) {
    await this.ensureSweetExists(id);

    return this.prisma.sweet.update({
      where: { id },
      data: {
        ...data,
        description: data.description ?? undefined,
        imageUrl: data.imageUrl ?? undefined,
      },
    });
  }

  delete(id: string) {
    return this.prisma.sweet.delete({ where: { id } });
  }

  async purchase(id: string, quantity: number, userId: string) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    return this.prisma.$transaction(async (tx) => {
      const sweet = await tx.sweet.findUnique({ where: { id } });

      if (!sweet) {
        throw new NotFoundException('Sweet not found');
      }

      if (sweet.quantity < quantity) {
        throw new BadRequestException('Not enough stock available');
      }

      const updatedSweet = await tx.sweet.update({
        where: { id },
        data: {
          quantity: { decrement: quantity },
        },
      });

      await tx.purchase.create({
        data: {
          sweetId: id,
          userId,
          quantity,
          priceAtPurchase: sweet.price,
        },
      });

      return updatedSweet;
    });
  }

  async restock(id: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    return this.prisma.sweet.update({
      where: { id },
      data: {
        quantity: { increment: quantity },
      },
    });
  }

  findPurchases(userId: string) {
    return this.prisma.purchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { sweet: true },
    });
  }

  private async ensureSweetExists(id: string) {
    const exists = await this.prisma.sweet.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Sweet not found');
    }
  }
}
