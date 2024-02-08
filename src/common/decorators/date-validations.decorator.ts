import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { format, isAfter, isBefore, isEqual } from 'date-fns';

export function IsDateAfter(
  date: Date,
  validationOptions: ValidationOptions = {},
) {
  const {
    message = `La fecha debe ser posterior a ${format(date, 'dd-MM-yyyy')}`,
  } = validationOptions;
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateAfterToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return isAfter(value, date);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property}: ${message}`;
        },
      },
    });
  };
}

export function IsDateBefore(
  date: Date,
  validationOptions: ValidationOptions = {},
) {
  const {
    message = `La fecha debe ser anterior a ${format(date, 'dd-MM-yyyy')}`,
  } = validationOptions;
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateAfterToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return isBefore(value, date);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property}: ${message}`;
        },
      },
    });
  };
}

export function IsDateEqualOrBefore(
  date: Date,
  validationOptions: ValidationOptions = {},
) {
  const {
    message = `La fecha debe ser igual o anterior a ${format(
      date,
      'dd-MM-yyyy',
    )}`,
  } = validationOptions;
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateAfterToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return isEqual(value, date) || isBefore(value, date);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property}: ${message}`;
        },
      },
    });
  };
}

export function IsDateEqualOrAfter(
  date: Date,
  validationOptions: ValidationOptions = {},
) {
  const {
    message = `La fecha debe ser igual o posterior a ${format(
      date,
      'dd-MM-yyyy',
    )}`,
  } = validationOptions;
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateAfterToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return isEqual(value, date) || isAfter(value, date);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property}: ${message}`;
        },
      },
    });
  };
}
