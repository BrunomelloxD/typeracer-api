import { Controller, Get, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TextService } from '../services/text.service';
import { GetRandomTextDto } from '../dtos/request/get-random-text.dto';
import { TextResponseDto } from '../dtos/response/text-response.dto';

@ApiTags('Texts')
@Controller('api/texts')
export class TextController {
    constructor(private readonly textService: TextService) {}

    @Get('random')
    @ApiOperation({
        summary: 'Obter um texto aleatório para o desafio de digitação',
        description: 'Retorna um texto filtrado por dificuldade e/ou idioma.',
    })
    @ApiOkResponse({ type: TextResponseDto })
    @ApiNotFoundResponse({ description: 'Nenhum texto encontrado para os filtros informados.' })
    async getRandom(@Query() query: GetRandomTextDto): Promise<TextResponseDto> {
        return this.textService.getRandom(query.difficulty, query.language);
    }
}
