import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Connection } from 'mongoose';

export class MongoConfiguration {
  @IsOptional()
  @IsString()
  URL: string;

  @IsOptional()
  @IsString()
  DB_NAME: string;

  @IsOptional()
  @IsNumber()
  POOL_SIZE: number;

  @IsOptional()
  @IsNumber()
  CONNECT_TIMEOUT_MS: number;

  @IsOptional()
  @IsNumber()
  SOCKET_TIMEOUT_MS: number;

  constructor(data?: Partial<MongoConfiguration>) {
    this.URL = data?.URL || process.env['MONGO_URL'] || '';
    this.DB_NAME = data?.DB_NAME || process.env['MONGO_DB_NAME'] || '';
    this.POOL_SIZE = data?.POOL_SIZE || Number(process.env['MONGO_POOL_SIZE']) || 10;
    this.CONNECT_TIMEOUT_MS = data?.CONNECT_TIMEOUT_MS || Number(process.env['MONGO_CONNECT_TIMEOUT_MS']) || 30000;
    this.SOCKET_TIMEOUT_MS = data?.SOCKET_TIMEOUT_MS || Number(process.env['MONGO_SOCKET_TIMEOUT_MS']) || 30000;
  }
}

export const MongoProvider = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    uri: config.get('MONGO_CONFIG.URL'),
    dbName: config.get('MONGO_CONFIG.DB_NAME'),
    socketTimeoutMS: config.get('MONGO_CONFIG.SOCKET_TIMEOUT_MS'),
    connectTimeoutMS: config.get('MONGO_CONFIG.CONNECT_TIMEOUT_MS'),
    maxPoolSize: config.get('MONGO_CONFIG.POOL_SIZE'),
    onConnectionCreate: (connection: Connection) => {
      connection.on('connected', () => {
        Logger.log('MongoDB connected successfully');
      });
      connection.on('open', () => {
        Logger.log('MongoDB connection opened');
      });
      connection.on('disconnecting', () => {
        Logger.log('MongoDB connection is disconnecting');
      });
      connection.on('disconnected', () => {
        Logger.warn('MongoDB disconnected');
      });
      connection.on('reconnected', () => {
        Logger.log('MongoDB reconnected');
      });
      return connection;
    },
  }),
});
