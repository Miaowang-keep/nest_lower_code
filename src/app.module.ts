import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrisamModule } from './modules/prisam/prisam.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule,PrisamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
