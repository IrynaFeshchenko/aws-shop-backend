import products from "../../mocked-data/products.json";
import { getProductsList } from "./get-products-list";

jest.mock("@libs/lambda", () => {
  return {
    middyfy: (e) => e,
  };
});

describe("Get products list", () => {
  it("should return products", async () => {
    const expected = {
      body: JSON.stringify(products),
      statusCode: 200,
    };
    const actual = await getProductsList(
      {
        body: null,
      } as any,
      {} as any,
      {} as any
    );

    expect(actual).toEqual(expect.objectContaining(expected));
  });
});
