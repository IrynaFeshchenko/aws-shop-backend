import "reflect-metadata";
import { DataSource } from "typeorm";
import { ConfigEnum } from "@libs/enums/config.enum";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { StocksEntity } from "@libs/entities/stocks.entity";
import { ProductsEntity } from "@libs/entities/products.entity";

export class DatabaseConnectionTypeOrm {
  private static instances: Map<string, DatabaseConnectionTypeOrm> = new Map();
  readonly con: Promise<DataSource>;

  protected constructor(connectionName: string) {
    console.log(`Creating DB connection with name ${connectionName}...`);
    this.con = new DataSource({
      type: "postgres",
      host: ConfigEnum.DB_HOST,
      database: "postgres",
      username: ConfigEnum.DB_USERNAME,
      password: ConfigEnum.DB_PASSWORD,
      synchronize: false,
      entities: [ProductsEntity, StocksEntity],
      name: connectionName,
      namingStrategy: new SnakeNamingStrategy(),
    })
      .initialize()
      .then((conn: DataSource) => {
        console.log(`DB connection with name ${connectionName} created!`);
        return conn;
      });
  }

  get getConnection(): Promise<DataSource> {
    return this.con.then((conn: DataSource) => {
      if (!conn.isInitialized) {
        return conn.initialize();
      }

      return conn;
    });
  }

  static getInstance(connectionName: string) {
    if (!this.instances.has(connectionName)) {
      this.instances.set(
        connectionName,
        new DatabaseConnectionTypeOrm(connectionName)
      );
    }

    return this.instances.get(connectionName);
  }
}
