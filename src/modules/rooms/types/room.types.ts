import { Difficulty } from '@prisma/client';

export interface RoomPlayer {
    socketId: string;
    playerName: string;
    progress: number; // 0..100
    correctChars: number;
    totalKeystrokes: number;
    finished: boolean;
    finishedAt?: number;
    wpm?: number;
    accuracy?: number;
    durationMs?: number;
}

export interface InMemoryRoom {
    id: string;
    code: string;
    status: 'WAITING' | 'COUNTDOWN' | 'RUNNING' | 'FINISHED';
    difficulty: Difficulty;
    language: string;
    textId?: string;
    textContent?: string;
    startedAt?: number;
    players: Map<string, RoomPlayer>;
    maxPlayers: number;
}
