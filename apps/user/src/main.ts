import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  // transform:true 转换类型，比如 {username: 'zs', password: 1234 } 可以转换为 LoginUserDto
  app.useGlobalPipes(new ValidationPipe({transform:true}));
  app.enableCors()
  await app.listen(3001);
}
bootstrap();
