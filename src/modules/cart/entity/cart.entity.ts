import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType } from "../../../enums/enum";

@Entity({ name: "carts" })
export class CartEntity extends SharedEntity {
    @Column({ nullable: true })
    userId: number;

    @Column({ default: Boolean.False })
    isGuest: number;

    @Column({ nullable: true })
    guestUserId: string;

    @Column()
    productId: number;

    @Column()
    countryId: number;

    @Column({ default: 1 })
    itemCount: number;
};