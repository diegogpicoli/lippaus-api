import { Global, Module } from '@nestjs/common';
import { prismaAdapterProvider } from './providers/prisma.providers';
import { PrismaService } from './services/prisma.service';

@Global()
@Module({
  providers: [prismaAdapterProvider, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
