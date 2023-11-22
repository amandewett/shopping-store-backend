import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from '../email/email.service';
import { CountryEntity } from '../country/entity/country.entity';
import { CountryService } from '../country/country.service';
import { CountryModule } from '../country/country.module';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                UserEntity,
            ]
        ),
        forwardRef(() => CountryModule)
    ],
    controllers: [UserController],
    providers: [
        UserService,
        EmailService,
    ],
})
export class UserModule { }
