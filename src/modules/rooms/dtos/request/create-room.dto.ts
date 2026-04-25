import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
    @ApiPropertyOptional({ enum: Difficulty, example: Difficulty.MEDIUM })
    @IsOptional()
    @IsEnum(Difficulty)
    difficulty?: Difficulty;

    @ApiPropertyOptional({ example: 'pt-br' })
    @IsOptional()
    @IsString()
    language?: string;
}
