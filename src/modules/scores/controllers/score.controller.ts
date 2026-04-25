import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { ScoreService } from '../services/score.service';
import { CreateScoreDto } from '../dtos/request/create-score.dto';
import { ScoreResponseDto } from '../dtos/response/score-response.dto';

@ApiTags('Scores')
@Controller('api/scores')
export class ScoreController {
    constructor(private readonly scoreService: ScoreService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar resultado de uma partida' })
    @ApiCreatedResponse({ type: ScoreResponseDto })
    @ApiBadRequestResponse({ description: 'Dados inválidos' })
    async create(@Body() data: CreateScoreDto): Promise<ScoreResponseDto> {
        return this.scoreService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Listar scores recentes (placeholder de leaderboard)' })
    @ApiOkResponse({ type: ScoreResponseDto, isArray: true })
    async findRecent(
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ): Promise<ScoreResponseDto[]> {
        return this.scoreService.findRecent(limit);
    }
}
