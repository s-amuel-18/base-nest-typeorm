import { Module } from '@nestjs/common';
import { CodeVerificationService } from './code-verification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeVerification } from './entities/code-verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeVerification])],
  providers: [CodeVerificationService],
  exports: [TypeOrmModule, CodeVerificationService],
})
export class CodeVerificationModule {}
