import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { findByUsername: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn() },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
  });

  it('should return an access_token for valid credentials', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);
    const user: UserEntity = { id: 1, username: 'testuser', passwordHash };

    usersService.findByUsername.mockResolvedValue(user);
    jwtService.signAsync.mockResolvedValue('signed-jwt-token');

    const result = await authService.signIn('testuser', 'correct-password');

    expect(result).toEqual({ access_token: 'signed-jwt-token' });
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1, username: 'testuser' });
  });

  it('should throw UnauthorizedException for wrong password', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);
    const user: UserEntity = { id: 1, username: 'testuser', passwordHash };

    usersService.findByUsername.mockResolvedValue(user);

    await expect(authService.signIn('testuser', 'wrong-password')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException for non-existent user', async () => {
    usersService.findByUsername.mockResolvedValue(null);

    await expect(authService.signIn('nobody', 'password')).rejects.toThrow(UnauthorizedException);
  });
});
