import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { S3Service } from '../../storage/services/s3.service';

@Injectable()
export class StorageHealthService {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string, s3: S3Service): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    try {
      await s3.checkConnection();
      return indicator.up({ bucket: s3.getBucket() });
    } catch (e) {
      return indicator.down({ message: (e as Error).message });
    }
  }
}
