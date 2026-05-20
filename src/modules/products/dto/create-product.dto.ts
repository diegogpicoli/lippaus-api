import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ProductStatus } from '../../../generated/prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'CERV-001' })
  @IsString()
  @MinLength(1)
  code: string;

  @ApiProperty({ example: 'Heineken Long Neck 330ml' })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({
    enum: ProductStatus,
    required: false,
    default: ProductStatus.ATIVO,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
