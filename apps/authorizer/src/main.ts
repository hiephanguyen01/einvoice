import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const tcpUserAccessOptions = AppModule.CONFIGURATION.TCP_SERV.TCP_AUTHORIZE_SERVICE.options || {};
  const tcpPort = Number(tcpUserAccessOptions.port) || 3404;
  const tcpHost = tcpUserAccessOptions.host || 'localhost';
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: tcpPort,
      host: tcpHost,
    },
  });

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: AppModule.CONFIGURATION.GRPC_SERV.GRPC_AUTHORIZER_SERVICE.name,
      protoPath: AppModule.CONFIGURATION.GRPC_SERV.GRPC_AUTHORIZER_SERVICE.options.protoPath,
      url: AppModule.CONFIGURATION.GRPC_SERV.GRPC_AUTHORIZER_SERVICE.options.url,
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.AUTHORIZE_PORT || 3003;
  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
