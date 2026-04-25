import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '@prisma/client';
import {
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Length,
    Max,
    Min,
} from 'class-validator';

export class CreateScoreDto {
    @ApiProperty({ enum: GameMode, example: GameMode.SOLO })
    @IsEnum(GameMode)
    mode: GameMode;

    @ApiProperty({ example: 'bruno' })
    @IsString()
    @Length(1, 32)
    playerName: string;

    @ApiProperty({ example: 65.4, description: 'Palavras por minuto' })
    @IsNumber()
    @Min(0)
    @Max(500)
    wpm: number;

    @ApiProperty({ example: 96.5, description: 'Acurácia (0-100)' })
    @IsNumber()
    @Min(0)
    @Max(100)
    accuracy: number;

    @ApiProperty({ example: 60000, description: 'Duração em milissegundos' })
    @IsInt()
    @Min(0)
    @Max(10 * 60 * 1000)
    durationMs: number;

    @ApiPropertyOptional({ description: 'ID do texto utilizado' })
    @IsOptional()
    @IsUUID()
    textId?: string;

    @ApiPropertyOptional({ description: 'ID da sala (apenas modo DUEL)' })
    @IsOptional()
    @IsUUID()
    roomId?: string;
}
