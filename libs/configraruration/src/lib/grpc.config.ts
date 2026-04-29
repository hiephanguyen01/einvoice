import { GrpcOptions, Transport } from '@nestjs/microservices';
import { IsNotEmpty, IsObject } from 'class-validator';
import { join } from 'path';

export enum GRPC_SERVICES {
  AUTHORIZER_SERVICE = 'GRPC_AUTHORIZER_SERVICE',
  USER_ACCESS_SERVICE = 'GRPC_USER_ACCESS_SERVICE',
}

export class GrpcConfiguration {
  @IsObject()
  @IsNotEmpty()
  GRPC_AUTHORIZER_SERVICE: GrpcOptions & { name: string };

  // @IsObject()
  // @IsNotEmpty()
  // GRPC_USER_ACCESS_SERVICE: GrpcOptions & { name: string };

  constructor() {
    this.GRPC_AUTHORIZER_SERVICE = GrpcConfiguration.setValue({
      key: GRPC_SERVICES.AUTHORIZER_SERVICE,
      protoPath: './proto/authorizer.proto',
      host: process.env['GRPC_AUTHORIZER_SERVICE_HOST'] || '127.0.0.1',
      port: Number(process.env['GRPC_AUTHORIZER_SERVICE_PORT'] || 50051),
    });
    // this.GRPC_USER_ACCESS_SERVICE = GrpcConfiguration.setValue({
    //   key: GRPC_SERVICES.USER_ACCESS_SERVICE,
    //   protoPath: 'proto/user_access.proto',
    //   host: process.env['GRPC_USER_ACCESS_SERVICE_HOST'] || '127.0.0.1',
    //   port: Number(process.env['GRPC_USER_ACCESS_SERVICE_PORT'] || 50051),
    // });
  }
  private static setValue({
    key,
    protoPath,
    port = 50051,
    host = '127.0.0.1',
  }: {
    key: GRPC_SERVICES;
    protoPath: string | string[];
    port?: number;
    host?: string;
  }): GrpcOptions & { name: string } {
    return {
      name: key,
      transport: Transport.GRPC,
      options: {
        package: key,
        protoPath: Array.isArray(protoPath) ? protoPath.map((p) => join(__dirname, p)) : join(__dirname, protoPath),
        url: `${host}:${port}`,
      },
    };
  }
}
