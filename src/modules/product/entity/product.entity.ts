import { SharedEntity } from 'src/modules/shared/entity/shared.entity';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Boolean, Roles, RegistrationType } from "../../../enums/enum";

@Entity({ name: "products" })
export class ProductEntity extends SharedEntity {
    @Column()
    englishName: string;

    @Column()
    arabicName: string;

    @Column({ nullable: true, type: "longtext" })
    englishDescription: string;

    @Column({ nullable: true, type: "longtext" })
    arabicDescription: string;

    @Column()
    categoryId: number;

    @Column()
    subCategoryId: number;

    @Column()
    countryId: number;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    price: number;

    @Column({ nullable: true, type: 'json' })
    arrMedia: string[];

    @Column({ default: Boolean.False })
    isFeatured: number;

    @Column({ default: Boolean.False })
    isNewArrival: number;

    @Column({ default: Boolean.False })
    isPackage: number;

    @Column({ default: Boolean.True })
    isActive: number;

    @Column()
    addedBy: number;

    @Column({ type: "double", precision: 10, scale: 2, default: 0.00 })
    weight: number;
};