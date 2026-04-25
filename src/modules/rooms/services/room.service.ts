import { randomInt, randomUUID } from 'node:crypto';
import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Difficulty, RoomStatus } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/services/prisma.service';
import { TextService } from 'src/modules/texts/services/text.service';
import { CreateRoomDto } from '../dtos/request/create-room.dto';
import { RoomResponseDto } from '../dtos/response/room-response.dto';
import { InMemoryRoom, RoomPlayer } from '../types/room.types';

const DEFAULT_MAX_PLAYERS = 2;
const ROOM_CODE_MAX_RETRIES = 5;

@Injectable()
export class RoomService {
    private readonly logger = new Logger(RoomService.name);
    private readonly rooms = new Map<string, InMemoryRoom>(); // key: code

    constructor(
        private readonly prisma: PrismaService,
        private readonly textService: TextService,
    ) {}

    async createRoom(data: CreateRoomDto): Promise<RoomResponseDto> {
        const code = await this.generateUniqueCode();
        const id = randomUUID();

        const room: InMemoryRoom = {
            id,
            code,
            status: 'WAITING',
            difficulty: data.difficulty ?? Difficulty.MEDIUM,
            language: data.language ?? 'pt-br',
            players: new Map(),
            maxPlayers: DEFAULT_MAX_PLAYERS,
        };

        this.rooms.set(code, room);

        await this.prisma.room.create({
            data: { id, code, status: RoomStatus.WAITING },
        });

        this.logger.log(`Room created code=${code} difficulty=${room.difficulty}`);
        return { id: room.id, code: room.code, status: room.status };
    }

    getRoom(code: string): InMemoryRoom {
        const room = this.rooms.get(code);
        if (!room) throw new NotFoundException(`Sala ${code} não encontrada.`);
        return room;
    }

    findRoom(code: string): InMemoryRoom | undefined {
        return this.rooms.get(code);
    }

    addPlayer(code: string, socketId: string, playerName: string): InMemoryRoom {
        const room = this.getRoom(code);

        if (room.status !== 'WAITING') {
            throw new ConflictException('A sala já iniciou ou está finalizada.');
        }
        if (room.players.size >= room.maxPlayers) {
            throw new ConflictException('Sala cheia.');
        }
        if (room.players.has(socketId)) {
            throw new ConflictException('Jogador já está na sala.');
        }

        const player: RoomPlayer = {
            socketId,
            playerName: playerName.trim().slice(0, 32) || 'player',
            progress: 0,
            correctChars: 0,
            totalKeystrokes: 0,
            finished: false,
        };
        room.players.set(socketId, player);
        return room;
    }

    removePlayer(socketId: string): { room: InMemoryRoom; player: RoomPlayer } | null {
        for (const room of this.rooms.values()) {
            const player = room.players.get(socketId);
            if (player) {
                room.players.delete(socketId);
                return { room, player };
            }
        }
        return null;
    }

    updateProgress(
        code: string,
        socketId: string,
        progress: number,
        correctChars: number,
        totalKeystrokes: number,
    ): RoomPlayer {
        const room = this.getRoom(code);
        const player = room.players.get(socketId);
        if (!player) throw new NotFoundException('Jogador não está na sala.');

        if (progress < 0 || progress > 100) {
            throw new BadRequestException('progress deve estar entre 0 e 100.');
        }

        player.progress = progress;
        player.correctChars = correctChars;
        player.totalKeystrokes = totalKeystrokes;
        return player;
    }

    async assignText(code: string): Promise<{ id: string; content: string }> {
        const room = this.getRoom(code);
        const text = await this.textService.getRandom(room.difficulty, room.language);
        room.textId = text.id;
        room.textContent = text.content;
        return { id: text.id, content: text.content };
    }

    markStarted(code: string): void {
        const room = this.getRoom(code);
        room.status = 'RUNNING';
        room.startedAt = Date.now();
    }

    async finishRoom(code: string): Promise<InMemoryRoom> {
        const room = this.getRoom(code);
        room.status = 'FINISHED';

        await this.prisma.room.update({
            where: { id: room.id },
            data: {
                status: RoomStatus.FINISHED,
                finishedAt: new Date(),
                textId: room.textId,
                startedAt: room.startedAt ? new Date(room.startedAt) : undefined,
            },
        });

        // Remoção postergada para permitir leitura final
        setTimeout(() => this.rooms.delete(code), 60_000).unref();
        return room;
    }

    private async generateUniqueCode(): Promise<string> {
        for (let i = 0; i < ROOM_CODE_MAX_RETRIES; i++) {
            const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
            if (this.rooms.has(code)) continue;
            const exists = await this.prisma.room.findUnique({ where: { code } });
            if (!exists) return code;
        }
        throw new ConflictException('Não foi possível gerar um código único de sala.');
    }
}
