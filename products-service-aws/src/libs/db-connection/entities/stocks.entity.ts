import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductsEntity } from "@libs/db-connection/entities/products.entity";

@Entity("stocks")
export class StocksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ProductsEntity)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id",
  })
  product: ProductsEntity;

  @Column({
    type: "integer",
  })
  count: number;
}
