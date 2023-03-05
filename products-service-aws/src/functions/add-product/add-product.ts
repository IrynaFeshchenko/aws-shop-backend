import { ResponseBuilder, returnStatusErrors } from "@libs/api-gateway";
import { DatabaseConnectionTypeOrm } from "@libs/db-connection/db-connection.service";
import { ProductDto } from "@libs/db-connection/dtos/products.dtos";
import { ProductsEntity } from "@libs/db-connection/entities/products.entity";
import { StocksEntity } from "@libs/db-connection/entities/stocks.entity";
import { middyfy } from "@libs/lambda";
import { validatePostProductsBody } from "@libs/validations/add-product.validator";
import { Handler } from "aws-lambda";

const addNewProduct: Handler = (event, context) => {
  return returnStatusErrors(async () => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log("Create product event", event);
    const body: ProductDto = event.body;
    const validationRes = await validatePostProductsBody(new ProductDto(body));

    if (validationRes) {
      return validationRes;
    }

    const db = DatabaseConnectionTypeOrm.getInstance("addProduct");
    const connection = await db.getConnection;

    console.log(`This is body ${body}`);

    return await connection.transaction(async (entityManager) => {
      const { count, ...product } = body;

      console.log("Data of body request", { count, product });

      const newProduct = entityManager.create(ProductsEntity, product);
      const createdProduct = await entityManager.save(newProduct);

      console.log({ createdProduct });

      const newStock = entityManager.create(StocksEntity, {
        product: createdProduct,
        count: count,
      });

      await entityManager.save(newStock);

      return new ResponseBuilder({ id: createdProduct.id })
        .setStatusCodeOfRequest(201)
        .build();
    });
  });
};

export const addProduct = middyfy(addNewProduct);
