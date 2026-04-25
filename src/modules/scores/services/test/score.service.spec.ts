import { Test } from '@nestjs/testing';
import { GameMode } from '@prisma/client';
import { ScoreService } from '../score.service';
import { ScoreRepository } from '../../repositories/score.repository';

describe('ScoreService', () => {
    let service: ScoreService;
    let repository: jest.Mocked<ScoreRepository>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ScoreService,
                {
                    provide: ScoreRepository,
                    useValue: {
                        create: jest.fn(),
                        findRecent: jest.fn(),
                        findByRoomId: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = moduleRef.get(ScoreService);
        repository = moduleRef.get(ScoreRepository);
    });

    it('cria score e devolve resposta tipada', async () => {
        const now = new Date();
        repository.create.mockResolvedValue({
            id: 's-1',
            mode: GameMode.SOLO,
            playerName: 'bruno',
            wpm: 80,
            accuracy: 97.2,
            durationMs: 60_000,
            textId: null,
            roomId: null,
            createdAt: now,
        });

        const result = await service.create({
            mode: GameMode.SOLO,
            playerName: 'bruno',
            wpm: 80,
            accuracy: 97.2,
            durationMs: 60_000,
        });

        expect(result.id).toBe('s-1');
        expect(result.wpm).toBe(80);
        expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('limita findRecent entre 1 e 100', async () => {
        repository.findRecent.mockResolvedValue([]);
        await service.findRecent(0);
        expect(repository.findRecent).toHaveBeenCalledWith(1);

        await service.findRecent(500);
        expect(repository.findRecent).toHaveBeenCalledWith(100);

        await service.findRecent();
        expect(repository.findRecent).toHaveBeenCalledWith(20);
    });
});
