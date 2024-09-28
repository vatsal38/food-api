import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../user.service';
import { LocalAuthGuard } from '../../auth/local-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Auth and User')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user and send OTP' })
  async signup(@Body() createUserDto: CreateUserDto) {
    const { username, password, email, firstName, lastName } = createUserDto;
    await this.userService.sendOTP(
      username,
      email,
      firstName,
      lastName,
      password,
    );
    return { message: 'OTP sent to your email' };
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        otp: { type: 'string' },
      },
    },
  })
  async verifyOtp(
    @Body()
    body: {
      username: string;
      otp: string;
    },
  ) {
    const { username, otp } = body;
    if (await this.userService.verifyOTP(username, otp)) {
      return { message: 'Verified successfully.' };
    } else {
      return { message: 'Otp not matched.' };
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(@Body() data: any) {
    return await this.userService.login(data);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset OTP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
      },
    },
  })
  async forgotPassword(
    @Body()
    body: {
      username: string;
    },
  ) {
    const { username } = body;
    await this.userService.sendPasswordResetOTP(username);
    return { message: 'Password reset OTP sent to your email' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with OTP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        otp: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  async resetPassword(
    @Body()
    body: {
      email: string;
      otp: string;
      newPassword: string;
    },
  ) {
    const { email, otp, newPassword } = body;
    await this.userService.resetPassword(email, otp, newPassword);
    return { message: 'Password reset successfully' };
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
    },
  })
  async resendOtp(
    @Body()
    body: {
      email: string;
    },
  ) {
    const { email } = body;
    await this.userService.resendOTP(email);
    return { message: 'OTP resent to your email' };
  }
}
