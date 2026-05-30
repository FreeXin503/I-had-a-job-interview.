import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
async function bootstrap() {
  // 禁用默认 body-parser 以便手动设置更大的 limit，防止 Base64 上传大文件时报 PayloadTooLargeError 错误
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // 手动配置大容量 body-parser 中间件
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // 静态文件托管
  app.use('/public', express.static(path.join(process.cwd(), 'public')));

  // 启用CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API前缀
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 面了个试后端服务启动成功！`);
  console.log(`📡 服务地址: http://localhost:${port}`);
  console.log(`📚 API文档: http://localhost:${port}/api`);
}

bootstrap();
