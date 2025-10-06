import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export enum GenderEnum {
  'male' = 'male',
  'female' = 'female',
}

export class RegisterDto {
  @ApiProperty({ description: 'Имя пользователя' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Фамилия пользователя' })
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'Password пользователя' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Email пользователя' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Дата рождения пользователя' })
  @IsDate()
  birth_date: Date;

  @ApiProperty({ description: 'Пол пользователя' })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ description: 'Интересы пользователя' })
  @IsString()
  interests: string;

  @ApiProperty({ description: 'Город пользователя' })
  @IsString()
  city: string;
}

export class LoginDto {
  @ApiProperty({ description: 'Email пользователя' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Password пользователя' })
  @IsString()
  password: string;
}

export class SearchQuery {
  @ApiProperty({ description: 'Часть имени для поиска' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Часть фамилии для поиска' })
  @IsString()
  last_name: string;
}
