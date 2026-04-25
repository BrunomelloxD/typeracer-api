import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { HealthModule } from 'src/modules/health/health.module';
import { TextModule } from 'src/modules/texts/text.module';
import { ScoreModule } from 'src/modules/scores/score.module';
import { RoomModule } from 'src/modules/rooms/room.module';
import { GameModule } from 'src/modules/game/game.module';

@Module({
    imports: [
        ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
        PrismaModule,
        HealthModule,
        TextModule,
        ScoreModule,
        RoomModule,
        GameModule,
    ],
})
export class AppModule {}

