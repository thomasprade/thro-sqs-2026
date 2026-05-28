import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { signIn: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(AuthController);
    authService = module.get(AuthService) as jest.Mocked<AuthService>;
  });

  describe('signIn', () => {
    it('should call authService.signIn and return the result', async () => {
      const expected = { access_token: 'jwt-token' };
      authService.signIn.mockResolvedValue(expected);

      const result = await controller.signIn({ username: 'user', password: 'pass' });

      expect(authService.signIn).toHaveBeenCalledWith('user', 'pass');
      expect(result).toEqual(expected);
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const req = { user: { sub: 1, username: 'testuser' } };
      expect(controller.getProfile(req)).toEqual({ sub: 1, username: 'testuser' });
    });
  });
});
