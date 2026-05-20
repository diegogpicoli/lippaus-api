import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/services/prisma.service';
import { S3Service } from '../../storage/services/s3.service';
import { generateThumbnail } from '../helpers/image.helper';
import type { CreateProductDto } from '../dto/create-product.dto';
import type { ListProductsQueryDto } from '../dto/list-products-query.dto';
import type { UpdateProductDto } from '../dto/update-product.dto';
import type { Prisma, Product } from '../../../generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async create(
    dto: CreateProductDto,
    foto?: Express.Multer.File,
  ): Promise<Product> {
    await this.ensureCodeAvailable(dto.code);
    const images = foto ? await this.storeImages(foto) : {};
    const product = await this.prisma.product.create({
      data: { ...dto, ...images },
    });
    return this.withUrls(product);
  }

  async findAll(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: Prisma.ProductWhereInput = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: data.map((product) => this.withUrls(product)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Product> {
    return this.withUrls(await this.getOrFail(id));
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    foto?: Express.Multer.File,
  ): Promise<Product> {
    const existing = await this.getOrFail(id);
    if (dto.code && dto.code !== existing.code) {
      await this.ensureCodeAvailable(dto.code);
    }
    let images = {};
    if (foto) {
      images = await this.storeImages(foto);
      await this.removeImages(existing);
    }
    const product = await this.prisma.product.update({
      where: { id },
      data: { ...dto, ...images },
    });
    return this.withUrls(product);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.getOrFail(id);
    await this.prisma.product.delete({ where: { id } });
    await this.removeImages(existing);
  }

  private async getOrFail(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  private async ensureCodeAvailable(code: string): Promise<void> {
    const existing = await this.prisma.product.findUnique({ where: { code } });
    if (existing) {
      throw new ConflictException('Código de produto já cadastrado');
    }
  }

  private async storeImages(
    foto: Express.Multer.File,
  ): Promise<{ image: string; thumbnail: string }> {
    const key = randomUUID();
    const ext = foto.mimetype.split('/')[1] ?? 'bin';
    const image = `products/${key}/original.${ext}`;
    const thumbnail = `products/${key}/thumb.webp`;
    const thumbnailBuffer = await generateThumbnail(foto.buffer);
    await this.s3.upload(image, foto.buffer, foto.mimetype);
    await this.s3.upload(thumbnail, thumbnailBuffer, 'image/webp');
    return { image, thumbnail };
  }

  private async removeImages(product: Product): Promise<void> {
    try {
      if (product.image) {
        await this.s3.delete(product.image);
      }
      if (product.thumbnail) {
        await this.s3.delete(product.thumbnail);
      }
    } catch {}
  }

  private withUrls(product: Product): Product {
    return {
      ...product,
      image: product.image ? this.s3.getPublicUrl(product.image) : null,
      thumbnail: product.thumbnail
        ? this.s3.getPublicUrl(product.thumbnail)
        : null,
    };
  }
}
