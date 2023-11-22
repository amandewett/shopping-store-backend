import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType } from "../../../enums/enum";

@Entity({ name: "users" })
export class UserEntity extends SharedEntity {
    @Column({
        nullable: true,
        unique: true,
    })
    email: string;

    @Column({ nullable: true })
    username: string;

    @Column({ nullable: true })
    googleId: string;

    @Column({ nullable: true })
    facebookId: string;

    @Column({ nullable: true })
    appleId: string;

    @Column({ nullable: true })
    password: string;

    @Column({ default: Boolean.False })
    isVerified: number;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: 1 })
    countryId: number;

    @Column({ default: Boolean.True })
    isActive: number;

    @Column({ default: Roles.Customer })
    role: string;

    @Column({ nullable: true })
    accountVerificationTimeStamp: Date;

    @Column({ nullable: true })
    forgotPasswordTimeStamp: Date;

    @Column({ nullable: true })
    accountVerificationOtp: string;

    @Column({ nullable: true })
    forgotPasswordOtp: string;

    @Column({ nullable: true })
    profilePicture: string;

    @Column({ default: RegistrationType.Normal })
    registrationType: number;

    @Column({ type: "json", nullable: true })
    staffRights: string[];
};