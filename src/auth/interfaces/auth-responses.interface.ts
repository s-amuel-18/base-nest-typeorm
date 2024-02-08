import { User } from 'src/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({ type: User })
  user: User;

  @ApiProperty()
  token: string;
}

export class ForgotPasswordCodeVerification {
  @ApiProperty()
  isValid: boolean;
}

export class SignUpResponse {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: User })
  user: User;
}
