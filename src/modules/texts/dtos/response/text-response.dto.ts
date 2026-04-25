import { ApiProperty } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';

export class TextResponseDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ example: 'O rato roeu a roupa do rei de Roma.' })
    content: string;

    @ApiProperty({ enum: Difficulty, example: Difficulty.MEDIUM })
    difficulty: Difficulty;

    @ApiProperty({ example: 'pt-br' })
    language: string;
}
