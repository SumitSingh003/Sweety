import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

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
      expect(true).toBe(false);
    });

    it('should throw error if email already exists', async () => {
      expect(true).toBe(false);
    });
  });

  describe('login', () => {
    it('should return JWT token for valid credentials', async () => {
      expect(true).toBe(false);
    });

    it('should throw error for invalid credentials', async () => {
      expect(true).toBe(false);
    });
  });
});
