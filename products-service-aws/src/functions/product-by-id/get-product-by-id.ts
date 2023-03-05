import { ResponseBuilder, returnStatusErrors } from "@libs/api-gateway";
import { DatabaseConnectionTypeOrm } from "@libs/db-connection/db-connection.service";
import { ProductDto } from "@libs/db-connection/dtos/products.dtos";
import { middyfy } from "@libs/lambda";
import { APIGatewayEvent, Handler } from "aws-lambda";

const getProduct: Handler<APIGatewayEvent> = (event, context) => {
  return returnStatusErrors(async () => {
    const { id } = event.pathParameters;

    console.log("Get product by id", event);
    context.callbackWaitsForEmptyEventLoop = false;

    const db = DatabaseConnectionTypeOrm.getInstance("getProductById");
    const connection = await db.getConnection;
    const productById: ProductDto[] = await connection.query(
      `SELECT products.id id, title, description, price, img_src imgSrc, count FROM products RIGHT JOIN stocks ON stocks.product_id = products.id where products.id = '${id}'`
    );

    if (!productById.length) {
      return new ResponseBuilder().setStatusCodeOfRequest(404).build();
    }

    if (!productById[0]) {
      return new ResponseBuilder().setStatusCodeOfRequest(404).build();
    }
    console.log(`Found product by id ${id}`, productById[0]);

    return new ResponseBuilder(productById[0]).build();
  });
};

export const getProductsById = middyfy(getProduct);
