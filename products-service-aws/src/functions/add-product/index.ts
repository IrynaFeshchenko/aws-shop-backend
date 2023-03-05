import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/add-product.addProduct`,
  events: [
    {
      http: {
        method: "post",
        path: "products",
        cors: true,
      },
    },
  ],
};
