import { Injectable } from '@nestjs/common';
import { Difficulty, Text } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/services/prisma.service';

@Injectable()
export class TextRepository {
    constructor(private readonly prisma: PrismaService) {}

    async countByFilter(difficulty?: Difficulty, language?: string): Promise<number> {
        return this.prisma.text.count({
            where: {
                ...(difficulty ? { difficulty } : {}),
                ...(language ? { language } : {}),
            },
        });
    }

    async findRandom(difficulty?: Difficulty, language?: string): Promise<Text | null> {
        const total = await this.countByFilter(difficulty, language);
        if (total === 0) return null;

        const skip = Math.floor(Math.random() * total);
        const [text] = await this.prisma.text.findMany({
            where: {
                ...(difficulty ? { difficulty } : {}),
                ...(language ? { language } : {}),
            },
            skip,
            take: 1,
        });

        return text ?? null;
    }

    async findById(id: string): Promise<Text | null> {
        return this.prisma.text.findUnique({ where: { id } });
    }
}
