import { ApiProperty } from '@nestjs/swagger';

import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
	@PrimaryGeneratedColumn()
	@ApiProperty()
	id: number;

	@Column({ name: 'amount' })
	@ApiProperty()
	amount: number;

	@Column({ name: 'currency' })
	@ApiProperty()
	currency: string;

	@Column({ name: 'paid_on' })
	@ApiProperty()
	paidOn: Date;

	@Column({ name: 'reference' })
	@ApiProperty()
	reference?: string;

	@Column({ name: 'description' })
	@ApiProperty()
	description?: string;

	@Column({ name: 'details' })
	@ApiProperty()
	details?: string;

	@CreateDateColumn()
	created_at: number;

	@UpdateDateColumn()
	updated_at: number;

	// * Relations
}
