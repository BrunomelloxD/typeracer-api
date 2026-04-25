import { Module } from '@nestjs/common';
import { ScoreController } from './controllers/score.controller';
import { ScoreService } from './services/score.service';
import { ScoreRepository } from './repositories/score.repository';

@Module({
    controllers: [ScoreController],
    providers: [ScoreService, ScoreRepository],
    exports: [ScoreService, ScoreRepository],
})
export class ScoreModule {}
