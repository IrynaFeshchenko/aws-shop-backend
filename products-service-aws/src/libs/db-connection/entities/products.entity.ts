import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class ProductsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  title: string;

  @Column({
    type: "varchar",
    length: 1000,
  })
  description: string;

  @Column({
    type: "integer",
  })
  price: number;

  @Column({
    type: "varchar",
    length: 500,
  })
  imgSrc: string;
}
