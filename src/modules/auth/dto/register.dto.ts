import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'admin@lippaus.com.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: 'lippaus123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ required: false, example: 'Admin Lippaus' })
  @IsOptional()
  @IsString()
  name?: string;
}
