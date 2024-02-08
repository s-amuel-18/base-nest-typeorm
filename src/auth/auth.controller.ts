import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// * Entities
import { User } from 'src/user/entities/user.entity';

// * Services
import { AuthService } from './auth.service';

// * Interfaces
import {
  ForgotPasswordCodeVerification,
  LoginResponse,
  SignUpResponse,
} from 'src/auth/interfaces/auth-responses.interface';

// * DTOs
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { verificationEmailDto } from './dto/verification-email.dto';
import { CodeVerification } from '../code-verification/entities/code-verification.entity';
import { CodeVerificationDto } from './dto/code-verification.dto';
import { CodeVerificationService } from 'src/code-verification/code-verification.service';
import { ForgotPasswordChangePasswordDto } from './dto/forgot-password.dto';
import { GoogleSingInDto } from './dto/google-sing-in.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly codeVerificationService: CodeVerificationService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiResponse({ status: 200, type: LoginResponse })
  async signIn(@Body() signInDto: SignInDto) {
    const { token, user } = await this.authService.login(signInDto);

    return { token, data: { user } };
  }
  @Post('google/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google sign in' })
  @ApiResponse({ status: 200, type: LoginResponse })
  async googleSignIn(@Body() googleSingInDto: GoogleSingInDto) {
    const { token, user } = await this.authService.googleSignUp(
      googleSingInDto,
    );
    // return { token, data: { user } };
    return { token, data: { user } };
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiResponse({ status: 201, type: SignUpResponse })
  async singUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);
    const token = await this.authService.generateToken(user.id);

    return {
      data: { user },
      token,
    };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Verificación de email y envio de correo' })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() verificationEmailDto: verificationEmailDto) {
    await this.authService.forgotPassword(verificationEmailDto.email);
    return {
      message: 'Correo electrónico enviado correctamente.',
    };
  }

  @Post('forgot-password/code-verification')
  @ApiOperation({
    summary: 'Verificación de codigo para el cambio de contraseña',
  })
  @ApiResponse({ status: 200, type: ForgotPasswordCodeVerification })
  @HttpCode(HttpStatus.OK)
  async forgotPasswordCodeVerification(@Body() { code }: CodeVerificationDto) {
    const isValid = await this.codeVerificationService.isCodeValid(code);
    return { data: { isValid } };
  }

  @Post('forgot-password/change-password')
  @ApiOperation({
    summary: 'Cambio de contraseña',
  })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  async forgotPasswordChangePassword(
    @Body() forgotPasswordChangePasswordDto: ForgotPasswordChangePasswordDto,
  ) {
    await this.authService.forgotPasswordchangePassword(
      forgotPasswordChangePasswordDto,
    );
    return { message: 'La contraseña fue actualizada correctamente.' };
  }
}
