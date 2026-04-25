import { Injectable, NotFoundException } from '@nestjs/common';
import { Difficulty, Text } from '@prisma/client';
import { TextRepository } from '../repositories/text.repository';
import { TextResponseDto } from '../dtos/response/text-response.dto';

@Injectable()
export class TextService {
    constructor(private readonly textRepository: TextRepository) {}

    async getRandom(difficulty?: Difficulty, language?: string): Promise<TextResponseDto> {
        const text = await this.textRepository.findRandom(difficulty, language);
        if (!text) {
            throw new NotFoundException('Nenhum texto disponível para os filtros informados.');
        }
        return this.toResponse(text);
    }

    async getById(id: string): Promise<Text> {
        const text = await this.textRepository.findById(id);
        if (!text) {
            throw new NotFoundException(`Texto ${id} não encontrado.`);
        }
        return text;
    }

    private toResponse(text: Text): TextResponseDto {
        return {
            id: text.id,
            content: text.content,
            difficulty: text.difficulty,
            language: text.language,
        };
    }
}
