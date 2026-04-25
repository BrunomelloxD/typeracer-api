import { Injectable } from '@nestjs/common';
import { Score } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/services/prisma.service';
import { CreateScoreDto } from '../dtos/request/create-score.dto';

@Injectable()
export class ScoreRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateScoreDto): Promise<Score> {
        return this.prisma.score.create({ data });
    }

    async findRecent(limit = 20): Promise<Score[]> {
        return this.prisma.score.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    async findByRoomId(roomId: string): Promise<Score[]> {
        return this.prisma.score.findMany({
            where: { roomId },
            orderBy: { wpm: 'desc' },
        });
    }
}
