import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@lippaus.com.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'lippaus123' })
  @IsString()
  password: string;
}
