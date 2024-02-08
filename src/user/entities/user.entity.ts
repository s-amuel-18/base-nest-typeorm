import { Exclude } from 'class-transformer';
import {
	AfterLoad,
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

// * Entities
import {
	Role,
	adminRoleId,
	clientRoleId,
	colaboratorRoleId,
} from 'src/list/entities/role.entity';
import { Gender } from 'src/list/entities/gender.entity';
import { Passport } from './passport.entity';
import { State } from 'src/list/entities/state.entity';

export const defaultUserTimezone = 'America/Caracas';
export const countBookingPerUser = 3;

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	@ApiProperty()
	id: number;

	@Column({ name: 'created_by' })
	@ApiProperty()
	@Exclude()
	createdByUserId?: number;

	@Column({ name: 'gender_id' })
	@ApiProperty()
	@Exclude()
	genderId?: number;

	@Column({ name: 'role_id' })
	@Exclude()
	@ApiProperty()
	roleId: number;

	@Column({ name: 'timezone', default: defaultUserTimezone })
	@ApiProperty()
	timezone?: string;

	@Column({ name: 'tax_identification' })
	@ApiProperty()
	taxIdentification?: string;

	@Column({ name: 'state_id' })
	@Exclude()
	@ApiProperty()
	stateId: number;

	@Column()
	@ApiProperty()
	email: string;

	@Column()
	@Exclude()
	@ApiProperty()
	password: string;

	@Column()
	@ApiProperty()
	name?: string = null;

	@Column({ name: 'second_name' })
	@ApiProperty()
	secondName?: string = null;

	@Column()
	@ApiProperty()
	surname?: string = null;

	@Column({ name: 'second_surname' })
	@ApiProperty()
	secondSurname?: string = null;

	@Column({ name: 'phone_number' })
	@ApiProperty()
	phoneNumber?: string;

	@Column({ name: 'second_phone_number' })
	@ApiProperty()
	secondPhoneNumber?: string = null;

	@Column({ name: 'residence_address' })
	@ApiProperty()
	residenceAddress?: string = null;

	@Column({ name: 'residence_city' })
	@ApiProperty()
	residenceCity?: string;

	@Column({ name: 'postal_code' })
	@ApiProperty()
	postalCode?: string = null;

	@Column()
	@ApiProperty()
	birthdate?: string = null;

	@Column({ name: 'created_at' })
	@ApiProperty()
	createdAt: Date;

	@Column({ name: 'updated_at' })
	@ApiProperty()
	updatedAt: Date;

	// * Relationship
	@OneToOne((type) => Role)
	@JoinColumn({ name: 'role_id' })
	role: Role;

	@OneToOne((type) => Gender)
	@JoinColumn({ name: 'gender_id' })
	gender?: Gender;

	@OneToOne((type) => State)
	@JoinColumn({ name: 'state_id' })
	state?: State;

	@OneToOne((type) => User)
	@JoinColumn({ name: 'created_by' })
	creatorUser?: User;

	@OneToOne((type) => Passport, (passport) => passport.user)
	passport?: Passport;

	private tempPassword: string;

	// * Hooks
	@AfterLoad()
	private loadTempPassword(): void {
		this.tempPassword = this.password;
	}

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		if (!this.password || this.tempPassword == this.password) return;
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}

	@BeforeUpdate()
	@BeforeInsert()
	async setDefaultTimezone() {
		if (!this.timezone) this.timezone = defaultUserTimezone;
	}

	// * Scopes nested
	static withDetails() {
		return {
			relations: {
				role: true,
				gender: true,
				passport: true,
				state: {
					country: true,
				},
			},
		};
	}

	// * Methods
	completeName() {
		return this.name ? `${this.name} ${this.surname}` : null;
	}

	verifyPassword(password: string) {
		return bcrypt.compareSync(password, this.password);
	}

	isAdmin() {
		return this.roleId == adminRoleId;
	}

	isColaborator() {
		return this.roleId == colaboratorRoleId;
	}

	isClient() {
		return this.roleId == clientRoleId;
	}
}
