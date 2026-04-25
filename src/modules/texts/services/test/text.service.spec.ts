import { Test } from '@nestjs/testing';
import { Difficulty } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { TextService } from '../text.service';
import { TextRepository } from '../../repositories/text.repository';

describe('TextService', () => {
    let service: TextService;
    let repository: jest.Mocked<TextRepository>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                TextService,
                {
                    provide: TextRepository,
                    useValue: {
                        findRandom: jest.fn(),
                        findById: jest.fn(),
                        countByFilter: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = moduleRef.get(TextService);
        repository = moduleRef.get(TextRepository);
    });

    it('retorna o texto aleatório no formato de resposta', async () => {
        repository.findRandom.mockResolvedValue({
            id: 'id-1',
            content: 'Frase de teste',
            difficulty: Difficulty.EASY,
            language: 'pt-br',
            createdAt: new Date(),
        });

        const result = await service.getRandom(Difficulty.EASY, 'pt-br');

        expect(result).toEqual({
            id: 'id-1',
            content: 'Frase de teste',
            difficulty: Difficulty.EASY,
            language: 'pt-br',
        });
        expect(repository.findRandom).toHaveBeenCalledWith(Difficulty.EASY, 'pt-br');
    });

    it('lança NotFound quando não há textos', async () => {
        repository.findRandom.mockResolvedValue(null);
        await expect(service.getRandom()).rejects.toBeInstanceOf(NotFoundException);
    });

    it('getById lança NotFound quando o texto não existe', async () => {
        repository.findById.mockResolvedValue(null);
        await expect(service.getById('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
});
