import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType, CustomerAddressType } from "../../../enums/enum";

@Entity({ name: "customer_addresses" })
export class CustomerAddressEntity extends SharedEntity {
    @Column()
    userId: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phoneNumber: string;

    @Column({ default: Boolean.False })
    isInternational: number;

    @Column()
    countryId: number;

    @Column({ default: 0 })
    stateId: number;

    @Column()
    address: string;

    @Column({ nullable: true })
    address2: string;

    @Column()
    city: string;

    @Column()
    postalCode: string;

    @Column({ default: Boolean.False })
    isDefault: number;

    @Column({ default: Boolean.False })
    isDeleted: number;
}; 