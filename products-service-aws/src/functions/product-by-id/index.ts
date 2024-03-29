import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/get-product-by-id.getProductsById`,
  events: [
    {
      http: {
        method: "get",
        path: "products/{id}",
        cors: true,
      },
    },
  ],
};
