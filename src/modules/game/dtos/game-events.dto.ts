import { IsInt, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class JoinRoomPayload {
    @IsString()
    @Length(6, 6)
    code: string;

    @IsString()
    @Length(1, 32)
    playerName: string;
}

export class ProgressUpdatePayload {
    @IsString()
    @Length(6, 6)
    code: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    progress: number;

    @IsInt()
    @Min(0)
    correctChars: number;

    @IsInt()
    @Min(0)
    totalKeystrokes: number;
}

export class FinishGamePayload {
    @IsString()
    @Length(6, 6)
    code: string;

    @IsNumber()
    @Min(0)
    @Max(500)
    wpm: number;

    @IsNumber()
    @Min(0)
    @Max(100)
    accuracy: number;

    @IsInt()
    @Min(0)
    durationMs: number;
}
