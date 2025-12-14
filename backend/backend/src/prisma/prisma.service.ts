import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
    await this.ensureAdminUser();
    await this.ensureSeedSweets();
  }

  private async ensureAdminUser() {
    const adminEmail = 'admin@sweety.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123';

    const adminExists = await this.user.findUnique({
      where: { email: adminEmail },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await this.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          fullName: 'Admin',
          role: 'ADMIN',
        },
      });

      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  }

  private async ensureSeedSweets() {
    const sweetCount = await this.sweet.count();
    if (sweetCount > 0) {
      return;
    }

    const sampleSweets = [
      {
        name: 'Midnight Chocolate Truffle',
        category: 'Chocolates',
        description: '72% dark chocolate ganache with a hint of espresso.',
        price: 4.5,
        quantity: 24,
        imageUrl:
          'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Raspberry Velvet Cupcake',
        category: 'Cupcakes',
        description: 'Moist red velvet sponge topped with raspberry cream cheese frosting.',
        price: 3.75,
        quantity: 18,
        imageUrl:
          'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Salted Caramel Brownie',
        category: 'Brownies',
        description: 'Fudgy brownie swirled with house-made salted caramel.',
        price: 3.25,
        quantity: 30,
        imageUrl:
          'https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Pistachio Macaron Box',
        category: 'Macarons',
        description: '12 delicate pistachio macarons with creamy filling.',
        price: 12.0,
        quantity: 12,
        imageUrl:
          'https://images.unsplash.com/photo-1521917441209-e886f0404a7b?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Citrus Glazed Donut',
        category: 'Donuts',
        description: 'Yeast-raised donut with tangy lemon-orange glaze.',
        price: 2.75,
        quantity: 28,
        imageUrl:
          'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      },
    ];

    await this.sweet.createMany({ data: sampleSweets });
    console.log(`✅ Seeded ${sampleSweets.length} sweets`);
  }
}
