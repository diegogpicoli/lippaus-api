import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductStatus } from '../../generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './services/products.service';

const MAX_FOTO_SIZE = 5 * 1024 * 1024;

const fotoPipe = new ParseFilePipe({
  fileIsRequired: false,
  validators: [
    new MaxFileSizeValidator({ maxSize: MAX_FOTO_SIZE }),
    new FileTypeValidator({ fileType: /^image\// }),
  ],
});

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cadastrar um produto' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['code', 'description'],
      properties: {
        code: { type: 'string', example: 'CERV-001' },
        description: {
          type: 'string',
          example: 'Heineken Long Neck 330ml',
        },
        status: { type: 'string', enum: Object.values(ProductStatus) },
        foto: { type: 'string', format: 'binary' },
      },
    },
  })
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile(fotoPipe) foto?: Express.Multer.File,
  ) {
    return this.productsService.create(dto, foto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos (paginado, com filtro e busca)' })
  findAll(@Query() query: ListProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar um produto' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('foto'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar um produto' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string', enum: Object.values(ProductStatus) },
        foto: { type: 'string', format: 'binary' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile(fotoPipe) foto?: Express.Multer.File,
  ) {
    return this.productsService.update(id, dto, foto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um produto' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
