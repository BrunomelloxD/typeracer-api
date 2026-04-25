import { ApiProperty } from '@nestjs/swagger';

export class RoomResponseDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ example: '482931', description: 'Código de 6 dígitos para compartilhar' })
    code: string;

    @ApiProperty({ example: 'WAITING' })
    status: string;
}
