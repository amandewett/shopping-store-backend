import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType } from "../../../enums/enum";

@Entity({ name: "international_shipment" })
export class InternationalShipmentEntity extends SharedEntity {
    @Column()
    countryName: string;

    @Column()
    countryCode: string;

    @Column()
    countryImage: string;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    priceOne: number;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    priceTwo: number;

    @Column({ default: Boolean.True })
    isActive: number;
};