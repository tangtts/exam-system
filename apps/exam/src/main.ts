import { NestFactory } from '@nestjs/core';
import { ExamModule } from './exam.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ExamModule);
  // 现在用 connectMicroservice 就是再暴露 8888 的 TCP 服务。
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8888,
    },
  });
  app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe({transform:true}))
  app.enableCors()
  await app.listen(3002);
}
bootstrap();
