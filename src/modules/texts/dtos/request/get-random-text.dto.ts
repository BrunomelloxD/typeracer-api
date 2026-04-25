import { ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetRandomTextDto {
    @ApiPropertyOptional({
        enum: Difficulty,
        description: 'Dificuldade do texto',
        example: Difficulty.MEDIUM,
    })
    @IsOptional()
    @IsEnum(Difficulty)
    difficulty?: Difficulty;

    @ApiPropertyOptional({ description: 'Idioma (ex: pt-br, en)', example: 'pt-br' })
    @IsOptional()
    @IsString()
    language?: string;
}
