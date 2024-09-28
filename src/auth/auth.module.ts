import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import { UserController } from '../user/controller/user.controller';
import { User, UserSchema } from '../user/user.schema';
import { UserRepository } from '../user/user.repository';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from '../utils/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  providers: [UserService, UserRepository, LocalStrategy, JwtStrategy],
  controllers: [UserController],
})
export class AuthModule {}
