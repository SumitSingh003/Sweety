import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
  it('should create a new user with hashed password', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    mockPrisma.user.create.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashed-password',
      role: 'USER',
    });

    const user = await service.register(
      'test@example.com',
      'password123',
    );

    expect(user.email).toBe('test@example.com');
    expect(user.password).not.toBe('password123');
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });

  it('should throw error if email already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
    });

    await expect(
      service.register('test@example.com', 'password123'),
    ).rejects.toThrow('Email already exists');
  });
});

  describe('login', () => {
  it('should return JWT token for valid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
    });

    const token = await service.login('test@example.com', 'password123');

    expect(token).toHaveProperty('accessToken');
  });

  it('should throw error for invalid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login('test@example.com', 'wrongpass'),
    ).rejects.toThrow();
  });
});
});
