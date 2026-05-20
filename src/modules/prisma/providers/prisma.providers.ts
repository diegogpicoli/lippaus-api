import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { AppEnv } from '../../../config/configuration';
import { PRISMA_ADAPTER } from '../../../config/tokens';

export const prismaAdapterProvider: Provider = {
  provide: PRISMA_ADAPTER,
  useFactory: (config: ConfigService<AppEnv, true>): PrismaPg =>
    new PrismaPg({
      connectionString: config.get('DATABASE_URL', { infer: true }),
    }),
  inject: [ConfigService],
};
