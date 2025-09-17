import { IsEnum, IsString } from 'class-validator';

export enum GenderEnum {
  'male' = 'male',
  'female' = 'female',
}

export class RegisterDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  password: string;

  @IsString()
  email: string;

  @IsString()
  birth_date: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsString()
  interests: string;

  @IsString()
  city: string;
}

export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
