import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoURI = configService.get('DB_MONGO_URI');
        const database = configService.get('DB_MONGO_DATABASE');

        return {
          uri: mongoURI,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DbConfigModule {}
