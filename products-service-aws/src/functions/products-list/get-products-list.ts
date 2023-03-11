import { returnStatusErrors, ResponseBuilder } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { Handler } from "aws-lambda";
import { DatabaseConnectionTypeOrm } from "@libs/db-connection/db-connection.service";
import { ProductDto } from "@libs/db-connection/dtos/products.dtos";

const getProducts: Handler = (event, context) =>
  returnStatusErrors(async () => {
    console.log("Get products with event", event);
    context.callbackWaitsForEmptyEventLoop = false;

    const db = DatabaseConnectionTypeOrm.getInstance("getAllProducts");
    const connection = await db.getConnection;
    const allProducts: ProductDto[] = await connection.query(
      "SELECT products.id id, title, description, price, img_src imgSrc, count FROM products RIGHT JOIN stocks ON stocks.product_id = products.id"
    );

    console.log("Found products", allProducts);

    return new ResponseBuilder(allProducts).build();
  });

export const getProductsList = middyfy(getProducts);
