import { returnStatusErrors, ResponseBuilder } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { Handler } from "aws-lambda";
import products from "../../mocked-data/products.json";


const getProducts: Handler = () => {
    return returnStatusErrors(async () => new ResponseBuilder(products).build());
};

export const getProductsList = middyfy(getProducts);
