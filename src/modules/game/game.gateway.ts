import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { GameMode } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { server as serverConfig } from 'src/common/config/env.config';
import { RoomService } from 'src/modules/rooms/services/room.service';
import { ScoreService } from 'src/modules/scores/services/score.service';
import {
    FinishGamePayload,
    JoinRoomPayload,
    ProgressUpdatePayload,
} from './dtos/game-events.dto';

const COUNTDOWN_SECONDS = 3;

@WebSocketGateway({
    namespace: '/game',
    cors: {
        origin: serverConfig.config.corsOrigin ?? ['http://localhost:3000'],
        credentials: true,
    },
})
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class GameGateway implements OnGatewayInit, OnGatewayDisconnect {
    private readonly logger = new Logger(GameGateway.name);

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly roomService: RoomService,
        private readonly scoreService: ScoreService,
    ) {}

    afterInit(): void {
        this.logger.log('GameGateway initialized on namespace /game');
    }

    handleDisconnect(client: Socket): void {
        const result = this.roomService.removePlayer(client.id);
        if (!result) return;

        const { room, player } = result;
        this.logger.log(`Player ${player.playerName} disconnected from room ${room.code}`);

        this.server.to(room.code).emit('player_left', {
            socketId: client.id,
            playerName: player.playerName,
        });
    }

    @SubscribeMessage('join_room')
    async onJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: JoinRoomPayload,
    ): Promise<{ status: 'joined'; players: string[] }> {
        try {
            const room = this.roomService.addPlayer(payload.code, client.id, payload.playerName);
            await client.join(room.code);

            const playerNames = Array.from(room.players.values()).map(p => p.playerName);

            this.server.to(room.code).emit('player_joined', {
                socketId: client.id,
                playerName: payload.playerName,
                players: playerNames,
            });

            if (room.players.size === room.maxPlayers) {
                const text = await this.roomService.assignText(room.code);
                this.server.to(room.code).emit('room_ready', {
                    code: room.code,
                    text: text.content,
                    textId: text.id,
                });
                this.startCountdown(room.code);
            }

            return { status: 'joined', players: playerNames };
        } catch (err) {
            throw new WsException(this.errorMessage(err));
        }
    }

    @SubscribeMessage('progress_update')
    onProgressUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: ProgressUpdatePayload,
    ): void {
        try {
            const player = this.roomService.updateProgress(
                payload.code,
                client.id,
                payload.progress,
                payload.correctChars,
                payload.totalKeystrokes,
            );

            // Broadcast somente para os outros sockets da sala
            client.to(payload.code).emit('progress_update', {
                socketId: client.id,
                playerName: player.playerName,
                progress: player.progress,
            });
        } catch (err) {
            throw new WsException(this.errorMessage(err));
        }
    }

    @SubscribeMessage('finish_game')
    async onFinishGame(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: FinishGamePayload,
    ): Promise<void> {
        try {
            const room = this.roomService.getRoom(payload.code);
            const player = room.players.get(client.id);
            if (!player) throw new WsException('Jogador não está na sala.');

            player.finished = true;
            player.finishedAt = Date.now();
            player.wpm = payload.wpm;
            player.accuracy = payload.accuracy;
            player.durationMs = payload.durationMs;

            await this.scoreService.create({
                mode: GameMode.DUEL,
                playerName: player.playerName,
                wpm: payload.wpm,
                accuracy: payload.accuracy,
                durationMs: payload.durationMs,
                textId: room.textId,
                roomId: room.id,
            });

            const allFinished = Array.from(room.players.values()).every(p => p.finished);
            if (allFinished) {
                const ranking = Array.from(room.players.values())
                    .sort((a, b) => (b.wpm ?? 0) - (a.wpm ?? 0))
                    .map((p, idx) => ({
                        position: idx + 1,
                        playerName: p.playerName,
                        wpm: p.wpm ?? 0,
                        accuracy: p.accuracy ?? 0,
                        durationMs: p.durationMs ?? 0,
                    }));

                await this.roomService.finishRoom(room.code);
                this.server.to(room.code).emit('final_results', { ranking });
            } else {
                client.to(room.code).emit('opponent_finished', {
                    playerName: player.playerName,
                    wpm: payload.wpm,
                    accuracy: payload.accuracy,
                });
            }
        } catch (err) {
            throw new WsException(this.errorMessage(err));
        }
    }

    private startCountdown(code: string): void {
        let remaining = COUNTDOWN_SECONDS;
        const tick = () => {
            this.server.to(code).emit('countdown', { remaining });
            if (remaining === 0) {
                this.roomService.markStarted(code);
                this.server.to(code).emit('start_game', { startedAt: Date.now() });
                return;
            }
            remaining -= 1;
            setTimeout(tick, 1000).unref();
        };
        tick();
    }

    private errorMessage(err: unknown): string {
        if (err instanceof Error) return err.message;
        return 'Erro inesperado.';
    }
}
