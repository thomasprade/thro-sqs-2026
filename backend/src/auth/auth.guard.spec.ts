import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn() },
        },
        {
          provide: Reflector,
          useValue: { getAllAndOverride: jest.fn() },
        },
      ],
    }).compile();

    guard = module.get(AuthGuard);
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    reflector = module.get(Reflector) as jest.Mocked<Reflector>;
  });

  function createMockContext(authHeader?: string): ExecutionContext {
    const request = {
      headers: { authorization: authHeader },
    };
    return {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;
  }

  it('should allow access to public routes', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    const context = createMockContext();

    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should allow access with a valid token', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwtService.verifyAsync.mockResolvedValue({ sub: 1, username: 'testuser' });
    const context = createMockContext('Bearer valid-token');

    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException when no token is provided', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const context = createMockContext();

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid'));
    const context = createMockContext('Bearer invalid-token');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
