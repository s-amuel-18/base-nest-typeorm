import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentService],
  exports: [TypeOrmModule, PaymentService],
})
export class PaymentsModule {}
