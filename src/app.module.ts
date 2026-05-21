import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { loadConfig } from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [loadConfig] }),
    ThrottlerModule.forRoot([{ ttl: 60 * 1000, limit: 30 }]),
    PrismaModule,
    StorageModule,
    HealthModule,
    AuthModule,
    ProductsModule,
  ],
})
export class AppModule {}
