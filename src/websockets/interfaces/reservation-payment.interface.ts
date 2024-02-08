import { Payment } from 'src/payments/entities/payment.entity';

export class NewReservationPayment {
	buyTripId: number;
	payment: Payment;
	isPaymentCompleted: boolean;
	remainingAmount: number;
}
