import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class DatabaseHealthService {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(
    key: string,
    prisma: PrismaService,
  ): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    try {
      await prisma.$queryRaw`SELECT 1`;
      return indicator.up();
    } catch (e) {
      return indicator.down({ message: (e as Error).message });
    }
  }
}
