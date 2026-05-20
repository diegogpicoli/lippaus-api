import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from '../auth/decorators/public.decorator';
import { PrismaService } from '../prisma/services/prisma.service';
import { S3Service } from '../storage/services/s3.service';
import { DatabaseHealthService } from './services/database-health.service';
import { StorageHealthService } from './services/storage-health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly databaseHealth: DatabaseHealthService,
    private readonly prisma: PrismaService,
    private readonly storageHealth: StorageHealthService,
    private readonly s3: S3Service,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.databaseHealth.isHealthy('database', this.prisma),
      () => this.storageHealth.isHealthy('storage', this.s3),
    ]);
  }
}
