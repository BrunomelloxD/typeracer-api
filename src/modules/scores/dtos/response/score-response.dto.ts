import { ApiProperty } from '@nestjs/swagger';
import { GameMode } from '@prisma/client';

export class ScoreResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ enum: GameMode })
    mode: GameMode;

    @ApiProperty()
    playerName: string;

    @ApiProperty()
    wpm: number;

    @ApiProperty()
    accuracy: number;

    @ApiProperty()
    durationMs: number;

    @ApiProperty({ required: false, nullable: true })
    textId: string | null;

    @ApiProperty({ required: false, nullable: true })
    roomId: string | null;

    @ApiProperty()
    createdAt: Date;
}
