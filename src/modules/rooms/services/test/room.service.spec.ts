import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Difficulty, RoomStatus } from '@prisma/client';
import { RoomService } from '../room.service';
import { PrismaService } from 'src/common/prisma/services/prisma.service';
import { TextService } from 'src/modules/texts/services/text.service';

describe('RoomService', () => {
    let service: RoomService;
    let prisma: any;
    let textService: jest.Mocked<TextService>;

    beforeEach(async () => {
        prisma = {
            room: {
                create: jest.fn().mockResolvedValue({}),
                findUnique: jest.fn().mockResolvedValue(null),
                update: jest.fn().mockResolvedValue({}),
            },
        };
        const moduleRef = await Test.createTestingModule({
            providers: [
                RoomService,
                { provide: PrismaService, useValue: prisma },
                {
                    provide: TextService,
                    useValue: {
                        getRandom: jest.fn().mockResolvedValue({
                            id: 't-1',
                            content: 'texto',
                            difficulty: Difficulty.MEDIUM,
                            language: 'pt-br',
                        }),
                    },
                },
            ],
        }).compile();

        service = moduleRef.get(RoomService);
        textService = moduleRef.get(TextService);
    });

    it('createRoom gera código de 6 dígitos e persiste no banco', async () => {
        const room = await service.createRoom({});
        expect(room.code).toMatch(/^\d{6}$/);
        expect(prisma.room.create).toHaveBeenCalledWith({
            data: { id: room.id, code: room.code, status: RoomStatus.WAITING },
        });
    });

    it('addPlayer recusa quando a sala não está em WAITING', async () => {
        const created = await service.createRoom({});
        service.addPlayer(created.code, 'sock-1', 'a');
        service.addPlayer(created.code, 'sock-2', 'b');
        // simula início manual via assignText + markStarted
        await service.assignText(created.code);
        service.markStarted(created.code);

        expect(() => service.addPlayer(created.code, 'sock-3', 'c')).toThrow(ConflictException);
    });

    it('addPlayer recusa quando sala está cheia (2 jogadores)', async () => {
        const created = await service.createRoom({});
        service.addPlayer(created.code, 'sock-1', 'a');
        service.addPlayer(created.code, 'sock-2', 'b');
        expect(() => service.addPlayer(created.code, 'sock-3', 'c')).toThrow(ConflictException);
    });

    it('removePlayer remove jogador da sala correta', async () => {
        const created = await service.createRoom({});
        service.addPlayer(created.code, 'sock-1', 'a');
        const removed = service.removePlayer('sock-1');
        expect(removed?.player.playerName).toBe('a');
        expect(removed?.room.players.size).toBe(0);
    });

    it('updateProgress lança quando jogador não existe', async () => {
        const created = await service.createRoom({});
        expect(() => service.updateProgress(created.code, 'ghost', 50, 0, 0)).toThrow(
            NotFoundException,
        );
    });

    it('getRoom lança NotFound para código inexistente', () => {
        expect(() => service.getRoom('000000')).toThrow(NotFoundException);
    });
});
