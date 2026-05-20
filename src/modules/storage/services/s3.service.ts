import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateBucketCommand,
  HeadBucketCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { AppEnv } from '../../../config/configuration';
import { S3_CLIENT } from '../../../config/tokens';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT) private readonly client: S3Client,
    private readonly config: ConfigService<AppEnv, true>,
  ) {
    this.bucket = this.config.get('S3_BUCKET', { infer: true });
  }

  async onModuleInit(): Promise<void> {
    if (this.config.get('NODE_ENV', { infer: true }) !== 'production') {
      try {
        await this.ensureBucket();
      } catch {}
    }
  }

  getBucket(): string {
    return this.bucket;
  }

  async checkConnection(): Promise<void> {
    await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
  }

  private async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }
}
