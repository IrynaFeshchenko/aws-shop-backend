import { ResponseBuilder, returnStatusErrors } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayEvent, Handler } from "aws-lambda";
import products from "../../mocked-data/products.json";

const getProduct: Handler<APIGatewayEvent> = (event) => {
  return returnStatusErrors(async () => {
    const { id } = event.pathParameters;
    const product = (products as any).find((p) => p.id === id);

    if (!product) {
      return new ResponseBuilder().setStatusCodeOfRequest(404).build();
    }

    return new ResponseBuilder(product).build();
  });
};

export const getProductsById = middyfy(getProduct);
