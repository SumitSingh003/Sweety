import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';

      // Act
      // const user = await service.register(email, password);

      // Assert
      // expect(user.email).toBe(email);
      // expect(user.password).not.toBe(password);

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
