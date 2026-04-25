import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { PrismaHealthIndicator } from 'src/common/prisma/indicators/prisma-health.indicator';

@Module({
    imports: [TerminusModule],
    controllers: [HealthController],
    providers: [PrismaHealthIndicator],
})
export class HealthModule {}