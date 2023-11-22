import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType, Languages } from "../../../enums/enum";

@Entity({ name: "countries" })
export class CountryEntity extends SharedEntity {
    @Column({ unique: true })
    countryName: string;

    @Column({ unique: true })
    countryCode: string;

    @Column({ unique: true })
    currencyName: string;

    @Column({ unique: true })
    currencyCode: string;

    @Column({ unique: true, nullable: true })
    currencyCodeInArabic: string;

    @Column({ nullable: true })
    image: string;

    @Column({ default: Boolean.False })
    isDeleted: number;

    @Column({ default: Languages.english })
    defaultLanguage: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    latitude: string;

    @Column({ nullable: true })
    longitude: string;
};