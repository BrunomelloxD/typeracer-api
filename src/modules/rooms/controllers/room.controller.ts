import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomService } from '../services/room.service';
import { CreateRoomDto } from '../dtos/request/create-room.dto';
import { RoomResponseDto } from '../dtos/response/room-response.dto';

@ApiTags('Rooms')
@Controller('api/rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Criar uma sala de duelo e retornar o código de acesso' })
    @ApiOkResponse({ type: RoomResponseDto })
    async create(@Body() data: CreateRoomDto): Promise<RoomResponseDto> {
        return this.roomService.createRoom(data);
    }

    @Get(':code')
    @ApiOperation({ summary: 'Consultar status de uma sala em memória pelo código' })
    @ApiOkResponse({ type: RoomResponseDto })
    findByCode(@Param('code') code: string): RoomResponseDto {
        const room = this.roomService.getRoom(code);
        return { id: room.id, code: room.code, status: room.status };
    }
}
