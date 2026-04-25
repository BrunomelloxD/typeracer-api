import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { RoomModule } from '../rooms/room.module';
import { ScoreModule } from '../scores/score.module';

@Module({
    imports: [RoomModule, ScoreModule],
    providers: [GameGateway],
})
export class GameModule {}
