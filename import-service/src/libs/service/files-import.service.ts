import * as AWS from "aws-sdk";
import csvParser from "csv-parser";
import { ConfigEnum } from "@libs/enums/config.enum";
import catalogItemQueueService from "./catalog-items-queue.service";
import { ProductInterface } from "@libs/interfaces/products.interface";
import { DatabaseConnectionTypeOrm } from "@libs/service/db-connection.service";
import { ProductsEntity } from "@libs/entities/products.entity";
import { StocksEntity } from "@libs/entities/stocks.entity";

class ParseFileService {
  private s3: AWS.S3 = new AWS.S3({ region: "eu-central-1" });

  async parseAndMoveFile(name: string): Promise<void> {
    const data: unknown[] = await this.parseFile(name);

    await this.moveToFolderParsed(name);

    const db = DatabaseConnectionTypeOrm.getInstance("addProduct");
    const connection = await db.getConnection;
    console.log(`This id data ${data}`);
    (data as ProductInterface[]).map((productYes) => {
      console.log(`This is data ${productYes}`);
      return connection.transaction(async (entityManager) => {
        const { count, ...product } = productYes as ProductInterface;
  
        console.log("Data of body request", { count, product });
        product.price = Number(product.price);
        const numberChange = Number(count);
  
        const newProduct = entityManager.create(ProductsEntity, product);
        const createdProduct = await entityManager.save(newProduct);
  
        console.log({ createdProduct });
  
        const newStock = entityManager.create(StocksEntity, {
          product: createdProduct,
          count: numberChange,
        });
  
        await entityManager.save(newStock);
      });
    });

    const productNames: string = await (data as ProductInterface[])
      .map((product) => `"${product.title}"`)
      .join(", ");

    await catalogItemQueueService.addToQueue({
      success: false,
      message: `Successfully added products to the DB ${productNames}`,
    });
  }

  private parseFile(name: string): Promise<unknown[]> {
    const results = [];

    console.log(`Parsing CSV file ${name} started`);

    return new Promise<unknown[]>((res, rej) => {
      this.s3
        .getObject({
          Bucket: ConfigEnum.BUCKET_NAME,
          Key: name,
        })
        .createReadStream()
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          console.log(`Parsing of file ${name} finished!`);
          console.log(results);
          res(results);
        })
        .on("error", (error) => {
          console.error(`Parsing of file ${name} error`);
          rej(error);
        });
    });
  }

  private async moveToFolderParsed(name: string): Promise<void> {
    console.log(`Started moving file ${name} to parsed folder`);

    await this.s3
      .copyObject({
        Bucket: ConfigEnum.BUCKET_NAME,
        CopySource: ConfigEnum.BUCKET_NAME + "/" + name,
        Key: name.replace("uploaded", "parsed"),
      })
      .promise();

    console.log(`File ${name} copied to parsed folder`);

    await this.s3
      .deleteObject({
        Bucket: ConfigEnum.BUCKET_NAME,
        Key: name,
      })
      .promise();

    console.log(`File ${name} deleted from uploaded folder`);
  }
}

export default new ParseFileService();
