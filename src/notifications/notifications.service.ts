import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	forwardRef,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WebsocketsService } from '../websockets/websockets.service';
import { FindAllNotificationDto } from './dto/find-all-notification.dto';
import { ReadNotificationDto } from './dto/read-notifications.dto';
import { FinderOptions } from '../common/interfaces/services.interface';
import { NotificationTypesAllowed } from './entities/notification-type.entity';
import { ContentTypeNotification } from './interfaces/notification.interface';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class NotificationsService {
	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepository: Repository<Notification>,
		private readonly websocketsService: WebsocketsService,

		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	async create(userId: number, createNotificationDto: CreateNotificationDto) {
		try {
			const notificationData = this.notificationRepository.create({
				...createNotificationDto,
				userId,
			});
			const notificationCreated = await this.notificationRepository.save(
				notificationData,
			);
			const notification = await this.findById(notificationCreated.id);
			this.websocketsService.newNotification(userId, notification);

			return notification;
		} catch (error) {
			throw new Error(error);
		}
	}

	async findById(id: number, finderOptions: FinderOptions = {}) {
		const {
			throwExceptionIfNotFound = true,
			notFoundExceptionMessage = 'La notificación no existe.',
		} = finderOptions;
		const notification = await this.notificationRepository.findOne({
			where: { id },
			relations: {
				notificationType: true,
			},
		});

		if (notification) return notification;
		if (throwExceptionIfNotFound && !notification)
			throw new NotFoundException(notFoundExceptionMessage);

		return null;
	}

	async findAll(
		userId: number,
		findAllNotificationDto: FindAllNotificationDto,
	): Promise<{ countUnRead: number; countAll: number; rows: Notification[] }> {
		const { page = 0, limit = 10 } = findAllNotificationDto;

		const take = limit > -1 ? limit : null;
		const skip = limit > -1 ? page * limit : null;

		const [rows, count] = await this.notificationRepository.findAndCount({
			where: {
				userId,
			},
			relations: { notificationType: true },
			take,
			skip,
			order: {
				createdAt: 'DESC',
			},
		});

		const countUnRead = await this.countUnread(userId);
		return { countUnRead, countAll: count, rows };
	}

	async readNotification(
		userId: number,
		readNotificationDto: ReadNotificationDto,
	) {
		const { readAll = null, notificationId = null } = readNotificationDto;
		if (!readAll && !notificationId)
			throw new BadRequestException('Debe contener al menos un parametro.');

		if (readAll) {
			return await this.notificationRepository.update(
				{ userId },
				{ isRead: true },
			);
		}

		if (notificationId) {
			const notification = await this.findById(notificationId, {
				throwExceptionIfNotFound: true,
			});

			if (notification.userId != userId)
				throw new BadRequestException('No es el usuario de la notificación.');

			return await this.notificationRepository.update(
				{ id: notificationId },
				{ isRead: true },
			);
		}
	}

	async countUnread(userId: number) {
		return await this.notificationRepository.count({
			where: {
				userId,
				isRead: false,
			},
		});
	}
}
