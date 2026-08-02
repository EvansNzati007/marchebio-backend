// src/auth/dto/RegisterDto.ts
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Role } from '../../../generated/prisma/enums';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  numTel: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsEnum(Role, {
    message: 'Le r\u00f4le doit \u00eatre PRODUCTEUR ou ACHETEUR',
  })
  role: typeof Role.PRODUCTEUR | typeof Role.ACHETEUR;
}
