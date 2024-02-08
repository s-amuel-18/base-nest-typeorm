import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async findAll() {
    return await this.paymentRepository.find();
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepository.create(createPaymentDto);
    const paymentSaved = await this.paymentRepository.save(payment);
    return paymentSaved;
  }
}
