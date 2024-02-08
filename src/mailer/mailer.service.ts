import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
import Mail from 'nodemailer/lib/mailer';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
	constructor(private readonly configService: ConfigService) {}

	private readonly logger = new Logger('MailerService');
	private readonly mailFolterPathBase = '../../mails/';
	private readonly transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: Number(process.env.MAIL_PORT),
		secure: false,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASSWORD,
		},
	});

	async forgotPassword(user: User, code: string) {
		const template = await this.readHbsFile('/auth/forgot-password.hbs');
		const data = { code, completeName: user.completeName() };
		const html = template(data);

		try {
			this.sendMail({
				to: user.email,
				html,
				subject: 'Recuperación de contraseña',
			});
		} catch (error) {
			this.logger.error(error);
			throw new Error(error);
		}
	}

	sendMail(mailerOptions: Mail.Options) {
		return this.transporter.sendMail(
			{
				...mailerOptions,
				from: process.env.MAIL_FROM,
			},
			(error, info) => {
				if (error) {
					console.log(error);
					return;
				}

				console.log('Correo enviado: ' + info.response);
			},
		);
	}

	readHbsFile(mailPath: string): Promise<HandlebarsTemplateDelegate<any>> {
		return new Promise((resolve, reject) => {
			try {
				const HbsSource = fs.readFileSync(
					path.join(__dirname, this.mailFolterPathBase + mailPath),
					{ encoding: 'utf-8' },
				);
				const template = Handlebars.compile(HbsSource);
				resolve(template);
			} catch (error) {
				this.logger.error(error);
				throw new InternalServerErrorException();
			}
		});
	}
}
