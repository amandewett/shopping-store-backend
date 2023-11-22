import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType, Languages } from "../../../enums/enum";

@Entity({ name: "states" })
export class StateEntity extends SharedEntity {
    @Column()
    countryId: number;

    @Column()
    stateName: string;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    shipmentPrice: number;

    @Column()
    addedBy: number;

    @Column({ default: Boolean.True })
    isActive: number;
};