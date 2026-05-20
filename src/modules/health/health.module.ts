import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DatabaseHealthService } from './services/database-health.service';
import { StorageHealthService } from './services/storage-health.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [DatabaseHealthService, StorageHealthService],
})
export class HealthModule {}
