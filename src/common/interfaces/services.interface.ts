import { QueryRunner } from 'typeorm';

export class FinderOptions {
	throwExceptionIfNotFound?: boolean = true;
	notFoundExceptionMessage?: string;
	withRelations?: boolean = true;
	throwExceptionIfFound?: boolean = true;
	foundExceptionMessage?: string;
}

export class CreateOptions {
	// * Query Runner para manejar transacciones inicializadas
	queryRunnerTransaction?: QueryRunner | null;
}

export class UpdateOptions {
	// * Query Runner para manejar transacciones inicializadas
	queryRunnerTransaction?: QueryRunner | null;
}
