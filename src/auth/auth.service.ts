import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// * Services
import { UserService } from 'src/user/services/user.service';
import { CodeVerificationService } from 'src/code-verification/code-verification.service';
import { MailerService } from '../mailer/mailer.service';

// * DTOs
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ForgotPasswordChangePasswordDto } from './dto/forgot-password.dto';
import { GoogleSingInDto } from './dto/google-sing-in.dto';
import { googleAuthClient } from 'src/config/google-auth';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
		private readonly codeVerificationService: CodeVerificationService,
	) {}

	async login(signInDto: SignInDto) {
		const user = await this.userService.findByEmail(signInDto.email);
		if (!user.password)
			throw new UnauthorizedException('Las credenciales son incorrectas.');

		if (!user.verifyPassword(signInDto.password))
			throw new UnauthorizedException('Las credenciales son incorrectas.');

		const token = await this.generateToken(user.id);
		return { token, user };
	}

	async generateToken(userId: number) {
		const token = await this.jwtService.signAsync({ userId });
		return token;
	}

	async revalidateToken(token: string): Promise<string> {
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get('JWT_SECRET'),
			});

			if (!payload) return null;
			const { userId } = payload;

			if (!userId) return null;

			return this.generateToken(userId);
		} catch (error) {
			return null;
		}
	}

	async signUp(signUpDto: SignUpDto) {
		return await this.userService.signUp(signUpDto);
	}

	async googleSignUp(googleSingInDto: GoogleSingInDto) {
		const { token: googleToken } = googleSingInDto;

		const ticket = googleAuthClient.verifyIdToken({
			idToken: googleToken,
			audience: this.configService.get('GOOGLE_CLIENT_ID'),
		});

		const payload = (await ticket).getPayload();
		const { email, name } = payload;

		let user = await this.userService.findByEmail(email, {
			throwExceptionIfNotFound: false,
			withRelations: true,
		});

		if (!user)
			user = await this.userService.signUp({
				email: email,
				phoneNumber: null,
				password: null,
				name,
			});

		const token = await this.generateToken(user.id);
		return { token, user };
	}

	async forgotPassword(email: string) {
		const user = await this.userService.findByEmail(email, {
			throwExceptionIfNotFound: true,
			withRelations: false,
			notFoundExceptionMessage:
				'El correo electrónico no se encuentra registrado',
		});

		const codeVerification = await this.codeVerificationService.create(user.id);

		await this.mailerService.forgotPassword(user, codeVerification.code);
	}

	async forgotPasswordchangePassword(
		forgotPasswordChangePasswordDto: ForgotPasswordChangePasswordDto,
	) {
		const { code } = forgotPasswordChangePasswordDto;
		const codeVerification =
			await this.codeVerificationService.findValidCodeByCode(code, {
				throwExceptionIfNotFound: true,
			});
		const { user } = codeVerification;

		await this.userService.changePassword(
			user,
			forgotPasswordChangePasswordDto,
		);

		await this.codeVerificationService.verify(codeVerification);
	}

	async decryptToken(token: string) {
		return await this.jwtService.verifyAsync(token, {
			secret: this.configService.get('JWT_SECRET'),
		});
	}
}
