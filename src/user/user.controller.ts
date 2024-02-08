import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	ClassSerializerInterceptor,
	ParseIntPipe,
	Query,
	Res,
} from '@nestjs/common';
import { GetAuthUser } from 'src/auth/decorators/get-user.decorator';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiProduces,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Response } from 'express';

// * Services
import { UserService } from './services/user.service';
import { PassportService } from './services/passport.service';

// * DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { CreatePassportDto } from './dto/create-passport.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserIdPipe } from './pipes/user-id.pipe';

// * Entities
import { User } from './entities/user.entity';

// * Interfaces
import {
	ValidRoles,
	adminCodeRoles,
	auditCodeRoles,
} from './interfaces/valid-roles.interface';
import {
	CreateOrUpdatePassportResponse,
	UserCanContinueBookingResponse,
	UserResponse,
	UsersResponse,
} from './interfaces/user-response.interface';

@ApiTags('Users')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth('access-token')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly passportService: PassportService,
	) {}

	@Get()
	@Auth({ allowedRoles: [ValidRoles.admin] })
	@ApiOperation({ summary: 'Lista de usuarios' })
	@ApiResponse({ status: 200, type: UsersResponse })
	async findAll(
		@Query() findAllUserDto: FindAllUserDto,
		@GetAuthUser() authUser: User,
	) {
		const users = await this.userService.findAll(authUser, findAllUserDto);

		return {
			data: { users },
		};
	}

	@Get('report')
	@Auth({ allowedRoles: auditCodeRoles })
	@ApiOperation({ summary: 'Reporte de usuarios' })
	@ApiProduces(
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	)
	@ApiResponse({ status: 209, type: 'file' })
	async findAllReport(
		@Query() findAllUserDto: FindAllUserDto,
		@GetAuthUser() authUser: User,
		@Res({ passthrough: true }) res: Response,
	) {
		const xlsxFile = await this.userService.listUserReport(
			authUser,
			findAllUserDto,
		);

		res.set({
			'Content-Type':
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': `attachment; filename="${Date.now()}.xlsx"`,
		});

		res.send(xlsxFile);
	}

	@Get('/auth-data')
	@Auth()
	@ApiOperation({ summary: 'Datos del usuario autenticado' })
	@ApiResponse({
		status: 200,
		description: 'Datos del usuario autenticado',
		type: UserResponse,
	})
	async findUserAuth(@GetAuthUser() authUser: User) {
		return { data: { user: authUser } };
	}

	@Get(':id')
	@Auth({ allowedRoles: adminCodeRoles })
	@ApiOperation({ summary: 'Buscar usuario por ID' })
	@ApiResponse({
		status: 200,
		description: 'Buscar usuario por ID',
		type: UserResponse,
	})
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const user = await this.userService.findOne(id);

		return { data: { user } };
	}

	@Post()
	@Auth({ allowedRoles: auditCodeRoles })
	@ApiOperation({ summary: 'Crear usuario' })
	@ApiResponse({
		status: 200,
		description: 'Usuario Creado',
		type: UserResponse,
	})
	async create(
		@Body() createUserDto: CreateUserDto,
		@GetAuthUser() authUser: User,
	) {
		const user = await this.userService.create(authUser, createUserDto);

		return {
			data: {
				user,
			},
		};
	}

	@Patch('/own-data')
	@ApiOperation({ summary: 'Actualización de usuario autenticado' })
	@ApiResponse({
		status: 200,
		description: 'Usuario autenticado actualizado',
		type: User,
	})
	@Auth()
	async updateOwnUserData(
		@Body() updateUserDto: UpdateUserDto,
		@GetAuthUser() authUser: User,
	) {
		const authUserId = authUser.id;
		const userUpdated = await this.userService.update(
			authUserId,
			updateUserDto,
		);

		return { data: { user: userUpdated } };
	}

	@Patch('passport')
	@ApiOperation({
		summary: 'Creación/actualización de pasaporte usuario autenticado',
	})
	@ApiResponse({
		status: 200,
		description: 'Creación/actualización de pasaporte',
		type: CreateOrUpdatePassportResponse,
	})
	@Auth()
	async createOrUpdatePassport(
		@Body() createPassportDto: CreatePassportDto,
		@GetAuthUser() user: User,
	) {
		const passport = await this.passportService.createOrUpdate(
			user.id,
			createPassportDto,
		);
		return {
			data: {
				passport,
			},
		};
	}

	@Patch('change-password')
	@ApiOperation({
		summary: 'Cambio de contraseña.',
	})
	@ApiResponse({
		status: 200,
		description: 'Contraseña cambiada exitosamente.',
	})
	@Auth()
	async changePassword(
		@Body() changePasswordDto: ChangePasswordDto,
		@GetAuthUser() authUser: User,
	) {
		await this.userService.changePasswirdByActualPassword(
			authUser.id,
			changePasswordDto,
		);

		return {
			message: 'La contraseña se ha actualizado correctamente.',
		};
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Actualización de usuario (Solo operadores del sistema)',
	})
	@ApiResponse({
		status: 200,
		description: 'Usuario actualizado',
		type: UserResponse,
	})
	@Auth({
		allowedRoles: auditCodeRoles,
	})
	async update(
		@Param('id', UserIdPipe) id: number,
		@Body() updateUserDto: UpdateUserDto,
		@GetAuthUser() authUser: User,
	) {
		const userUpdated = await this.userService.updateByOperatorUser(
			{ operatorUser: authUser, userId: id },
			updateUserDto,
		);

		return {
			data: {
				user: userUpdated,
			},
		};
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar usuario', deprecated: true })
	remove(@Param('id') id: string) {
		return this.userService.remove(+id);
	}
}
