import { ApiProperty } from '@nestjs/swagger';
import { Passport } from '../entities/passport.entity';
import { User } from '../entities/user.entity';

export class CreateOrUpdatePassportResponse {
  @ApiProperty({ type: Passport })
  passport: Passport;
}

export class UserResponse {
  @ApiProperty({ type: User })
  user: User;
}

export class UsersResponse {
  @ApiProperty({ type: [User] })
  user: User[];
}

export class UserCanContinueBookingResponse {
  @ApiProperty()
  canContinueBooking: boolean;
}
