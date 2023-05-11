import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';
import {logger} from './middleware/LoggerMiddleWare'
import { ResponseInterceptor,FormatterDateInterceptor } from './interceptor/interceptor.interceptor';
import { PrismaService } from './modules/prisam/prisam.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  //配置日志函数中间件
  app.use(logger)
  app.useGlobalInterceptors(new FormatterDateInterceptor())
  app.useGlobalInterceptors( new ResponseInterceptor())
  //swagger ui 配置文件
  const swaggerOptions = new DocumentBuilder()
  .addBearerAuth()
  .setTitle(`个人博客API文档`)
  .setDescription(`个人博客API解释文档`)
  .setVersion(`1.0.0`)
  .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
