import { Global, Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { s3ClientProvider } from './providers/storage.providers';

@Global()
@Module({
  providers: [s3ClientProvider, S3Service],
  exports: [S3Service],
})
export class StorageModule {}
