import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  ParseIntPipe,
  PipeTransform,
} from '@nestjs/common';
import { UserService } from '../services/user.service';

@Injectable()
export class UserIdPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const userId = await new ParseIntPipe().transform(value, metadata);
    const userExist = await this.userService.exist(userId);

    if (!userExist)
      throw new NotFoundException('El usuario no se encuentra registrado');

    return userId;
  }
}
