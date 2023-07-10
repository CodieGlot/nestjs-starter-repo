import { applyDecorators } from '@nestjs/common';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsDate,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    IsUrl,
    Max,
    MaxLength,
    Min,
    MinLength,
    ValidateNested
} from 'class-validator';
import { ToBoolean, ToLowerCase, ToUpperCase, Trim } from './transform.decorator';

interface IStringFieldOptions {
    each?: boolean;
    minLength?: number;
    maxLength?: number;
    toLowerCase?: boolean;
    toUpperCase?: boolean;
    swagger?: boolean;
}

interface INumberFieldOptions {
    each?: boolean;
    minimum?: number;
    maximum?: number;
    isInt?: boolean;
    isPositive?: boolean;
    swagger?: boolean;
}

export function NumberField(
    options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {}
): PropertyDecorator {
    const decorators = [IsNotEmpty(), Type(() => Number)];

    const { each, isInt, minimum, maximum, isPositive, swagger } = options;

    if (swagger !== false) {
        if (each) {
            decorators.push(ApiProperty({ type: () => [Number], ...options }));
        } else {
            decorators.push(ApiProperty({ type: () => Number, ...options }));
        }
    }

    if (each) {
        decorators.push(IsArray());
    }

    if (isInt) {
        decorators.push(IsInt({ each }));
    } else {
        decorators.push(IsNumber({}, { each }));
    }

    if (minimum) {
        decorators.push(Min(minimum, { each }));
    }

    if (maximum) {
        decorators.push(Max(maximum, { each }));
    }

    if (isPositive) {
        decorators.push(IsPositive({ each }));
    }

    return applyDecorators(...decorators);
}

export function NumberFieldOptional(
    options: Omit<ApiPropertyOptions, 'type' | 'required'> & INumberFieldOptions = {}
): PropertyDecorator {
    return applyDecorators(IsOptional(), NumberField({ required: false, ...options }));
}

export function StringField(
    options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {}
): PropertyDecorator {
    const decorators = [IsNotEmpty(), Trim(), IsString({ each: options.each })];

    const { each, minLength, maxLength, toLowerCase, toUpperCase, swagger } = options;

    if (swagger !== false) {
        if (each) {
            decorators.push(ApiProperty({ type: () => [String], ...options }));
        } else {
            decorators.push(ApiProperty({ type: () => String, ...options }));
        }
    }

    if (each) {
        decorators.push(IsArray());
    }

    if (minLength) {
        decorators.push(MinLength(minLength, { each }));
    }

    if (maxLength) {
        decorators.push(MaxLength(maxLength, { each }));
    }

    if (toLowerCase) {
        decorators.push(ToLowerCase());
    }

    if (toUpperCase) {
        decorators.push(ToUpperCase());
    }

    return applyDecorators(...decorators);
}

export function StringFieldOptional(
    options: Omit<ApiPropertyOptions, 'type' | 'required'> & IStringFieldOptions = {}
): PropertyDecorator {
    return applyDecorators(IsOptional(), StringField({ required: false, ...options }));
}

export function BooleanField(
    options: Omit<ApiPropertyOptions, 'type'> & Partial<{ swagger: boolean }> = {}
): PropertyDecorator {
    const decorators = [IsNotEmpty(), IsBoolean(), ToBoolean()];

    if (options.swagger !== false) {
        decorators.push(ApiProperty({ type: Boolean, ...options }));
    }

    return applyDecorators(...decorators);
}

export function BooleanFieldOptional(
    options: Omit<ApiPropertyOptions, 'type' | 'required'> & Partial<{ swagger: boolean }> = {}
): PropertyDecorator {
    return applyDecorators(IsOptional(), BooleanField({ required: false, ...options }));
}

export function EnumField<TEnum>(
    getEnum: () => TEnum,
    options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName'> &
        Partial<{
            each: boolean;
            swagger: boolean;
        }> = {}
): PropertyDecorator {
    const enumValue = getEnum();
    const decorators = [IsNotEmpty(), IsEnum(enumValue as object, { each: options.each })];

    if (options.swagger !== false) {
        if (options.each) {
            decorators.push(ApiProperty({ type: () => [enumValue], enum: enumValue, ...options }));
        } else {
            decorators.push(ApiProperty({ type: () => enumValue, enum: enumValue, ...options }));
        }
    }

    if (options.each) {
        decorators.push(IsArray());
    }

    return applyDecorators(...decorators);
}

export function EnumFieldOptional<TEnum>(
    getEnum: () => TEnum,
    options: Omit<ApiPropertyOptions, 'type' | 'required' | 'enum' | 'enumName'> &
        Partial<{ swagger: boolean }> = {}
): PropertyDecorator {
    return applyDecorators(IsOptional(), EnumField(getEnum, { required: false, ...options }));
}

export function EmailField(
    options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {}
): PropertyDecorator {
    const decorators = [IsNotEmpty(), IsEmail(), StringField({ toLowerCase: true, ...options })];

    if (options.swagger !== false) {
        decorators.push(ApiProperty({ type: String, ...options }));
    }

    return applyDecorators(...decorators);
}

export function EmailFieldOptional(
    options: Omit<ApiPropertyOptions, 'type' | 'required'> & IStringFieldOptions = {}
): PropertyDecorator {
    return applyDecorators(IsOptional(), EmailField({ required: false, ...options }));
}

// NOTE: ALWAYS USE ALONG WITH Type(() => ClassName))
export function ArrayOfObjectsField<T>(
    getType: () => T,
    options: Omit<ApiPropertyOptions, 'type'> &
        Partial<{ minSize: number; maxSize: number; swagger: boolean }> = {}
) {
    const typeValue = getType();
    const decorators = [IsNotEmpty(), IsArray(), ValidateNested({ each: true })];

    const { minSize, maxSize, swagger } = options;

    if (swagger !== false) {
        decorators.push(ApiProperty({ type: () => [typeValue] }));
    }

    if (minSize && minSize >= 0 && Number.isInteger(minSize)) {
        decorators.push(ArrayMinSize(minSize));
    }

    if (maxSize && maxSize >= 0 && Number.isInteger(maxSize)) {
        decorators.push(ArrayMaxSize(maxSize));
    }

    return applyDecorators(...decorators);
}

// NOTE: ALWAYS USE ALONG WITH Type(() => ClassName))
export function ArrayOfObjectsFieldOptional<T>(
    getType: () => T,
    options: Omit<ApiPropertyOptions, 'type' | 'required'> &
        Partial<{ minSize: number; maxSize: number; swagger: boolean }> = {}
) {
    return applyDecorators(IsOptional(), ArrayOfObjectsField(getType, { required: false, ...options }));
}

export function UUIDField(
    options: Omit<ApiPropertyOptions, 'type' | 'format'> & Partial<{ swagger: boolean }> = {}
): PropertyDecorator {
    const decorators = [IsNotEmpty(), IsUUID('4')];

    if (options.swagger !== false) {
        decorators.push(ApiProperty({ type: String, format: 'uuid', ...options }));
    }

    return applyDecorators(...decorators);
}

export function UUIDFieldOptional(
    options: Omit<ApiPropertyOptions, 'type' | 'format' | 'required'> & Partial<{ swagger: boolean }> = {}
): PropertyDecorator {
    return applyDecorators(IsOptional(), UUIDField({ required: false, ...options }));
}

export function URLField(
    options: Omit<ApiPropertyOptions, 'type'> & Partial<{ swagger: boolean }> = {}
): PropertyDecorator {
    return applyDecorators(IsNotEmpty(), StringField(options), IsUrl());
}

export function URLFieldOptional(
    options: Omit<ApiPropertyOptions, 'type' | 'required'> & Partial<{ swagger: boolean }> = {}
): PropertyDecorator {
    return applyDecorators(IsOptional(), URLField({ required: false, ...options }));
}

export function DateField(
    options: Omit<ApiPropertyOptions, 'type'> & Partial<{ swagger: boolean }> = {}
): PropertyDecorator {
    const decorators = [IsNotEmpty(), Type(() => Date), IsDate()];

    if (options.swagger !== false) {
        decorators.push(ApiProperty(options));
    }

    return applyDecorators(...decorators);
}

export function DateFieldOptional(
    options: Omit<ApiPropertyOptions, 'type' | 'required'> & Partial<{ swagger: boolean }> = {}
): PropertyDecorator {
    return applyDecorators(IsOptional(), DateField({ ...options, required: false }));
}
