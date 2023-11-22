import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType } from "../../../enums/enum";

@Entity({ name: "product_categories" })
export class ProductCategoryEntity extends SharedEntity {
    @Column({ unique: true })
    englishName: string;

    @Column({ unique: true })
    arabicName: string;

    @Column({ nullable: true })
    englishDescription: string;

    @Column({ nullable: true })
    arabicDescription: string;

    @Column({ default: Boolean.False })
    isFeatured: number;

    @Column({ nullable: true, type: 'json' })
    arrSubCategories: number[];

    @Column()
    addedBy: number;

    @Column({ default: Boolean.True })
    isActive: number;
};