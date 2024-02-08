export class CreatePaymentDto {
  amount: number;
  currency: string;
  paidOn: Date;
  reference: string;
  description?: string;
  details?: string;
}
