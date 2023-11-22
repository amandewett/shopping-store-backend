import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType } from "../../../enums/enum";

@Entity({ name: "tax" })
export class TaxEntity extends SharedEntity {
    @Column()
    taxName: string;

    @Column({ nullable: true })
    taxDescription: string;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    taxValue: number;

    @Column()
    countryId: number;

    @Column({ default: Boolean.True })
    isActive: number;
};