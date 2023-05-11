import { Module,Global } from '@nestjs/common';
import { PrismaService } from './prisam.service';

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrisamModule {}
