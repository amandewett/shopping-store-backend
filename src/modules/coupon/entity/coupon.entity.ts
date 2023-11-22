import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType, CouponType } from "../../../enums/enum";

@Entity({ name: "coupons" })
export class CouponEntity extends SharedEntity {
    @Column()
    couponName: string;

    @Column()
    couponNameInArabic: string;

    @Column({ nullable: true })
    couponDescription: string;

    @Column({ nullable: true })
    couponDescriptionInArabic: string;

    @Column({ type: "double", precision: 10, scale: 1, default: 0.0 })
    couponPercent: number;

    @Column()
    countryId: number;

    @CreateDateColumn()
    expiryDate: Date;

    @Column()
    couponCode: string;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    minCartValue: number;

    @Column({ default: Boolean.True })
    isActive: number;

    @Column({ default: CouponType.userCoupon })
    couponType: number;
}; 