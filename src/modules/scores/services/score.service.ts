import { Injectable } from '@nestjs/common';
import { Score } from '@prisma/client';
import { ScoreRepository } from '../repositories/score.repository';
import { CreateScoreDto } from '../dtos/request/create-score.dto';
import { ScoreResponseDto } from '../dtos/response/score-response.dto';

@Injectable()
export class ScoreService {
    constructor(private readonly scoreRepository: ScoreRepository) {}

    async create(data: CreateScoreDto): Promise<ScoreResponseDto> {
        const score = await this.scoreRepository.create(data);
        return this.toResponse(score);
    }

    async findRecent(limit?: number): Promise<ScoreResponseDto[]> {
        const safeLimit = Math.min(Math.max(limit ?? 20, 1), 100);
        const scores = await this.scoreRepository.findRecent(safeLimit);
        return scores.map(s => this.toResponse(s));
    }

    async findByRoom(roomId: string): Promise<ScoreResponseDto[]> {
        const scores = await this.scoreRepository.findByRoomId(roomId);
        return scores.map(s => this.toResponse(s));
    }

    private toResponse(score: Score): ScoreResponseDto {
        return {
            id: score.id,
            mode: score.mode,
            playerName: score.playerName,
            wpm: score.wpm,
            accuracy: score.accuracy,
            durationMs: score.durationMs,
            textId: score.textId,
            roomId: score.roomId,
            createdAt: score.createdAt,
        };
    }
}
