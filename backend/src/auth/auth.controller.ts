import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { SignInDto } from './sign-in.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.username, dto.password);
  }

  @Get('profile')
  getProfile(@Request() req: unknown) {
    return (req as { user: unknown }).user;
  }
}
