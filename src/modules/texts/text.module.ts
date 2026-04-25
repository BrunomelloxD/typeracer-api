import { Module } from '@nestjs/common';
import { TextController } from './controllers/text.controller';
import { TextService } from './services/text.service';
import { TextRepository } from './repositories/text.repository';

@Module({
    controllers: [TextController],
    providers: [TextService, TextRepository],
    exports: [TextService, TextRepository],
})
export class TextModule {}
